# Telemetry Schema — Addendum: Flush Semantics & Status Roll-Up

**Purpose:** Close the two undefined rules in the Component Telemetry Schema v1.0 (§6, §13) before implementation.
**Audience:** Backend team (`oc-telemetry`) + Frontend team (`OC-Customer-UI-Portal`).
**Status:** Proposed — for confirmation alongside the §13 open decisions.

These two rules are the only places where the current spec is logically *incomplete* (as opposed to just missing detail). Until they're fixed, aggregate metrics over `COMPONENT_SESSION` are undefined and the top-level `status` field is self-contradictory.

---

## Rule 1 — Buffer flush is delta-based ("snapshot-and-reset")

### The problem
A long-lived component flushes on a 60s timer (`flush_reason: "timer"`) and again on unmount/pagehide. The spec never states whether the buffer resets between flushes. Two readings are possible:

- **Cumulative:** every flush re-sends everything since mount. → payloads grow unbounded, the 100-event cap breaks, events are sent multiple times, and double-counting is guaranteed unless downstream dedupes.
- **Delta:** each flush sends only what accumulated since the last flush, then resets. → bounded payloads, no re-sends; downstream must aggregate across rows.

### Proposed rule: **delta**
On any flush (`timer`, `manual`, `pagehide`, `unmount`):

1. Send the buffer accumulated **since the last flush** (or since mount, for the first flush).
2. Set `component.lifecycle_phase`:
   - `"unmount"` when `flush_reason` is `unmount` or `pagehide` (the mount is ending),
   - `"flush"` otherwise.
3. If the mount is **not** ending, reset counters and `events[]`, keep the same `instance_id`, and start a fresh segment (`started_at_ms = now`).

### Two new fields required
Add to `component` (§12 `ComponentRef`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `flush_seq` | number | Yes | 1-based, monotonic per `instance_id`. Identifies segment order for a multi-flush mount. |
| `is_final` | boolean | Yes | `true` on the last segment (unmount/pagehide), `false` otherwise. Lets consumers pick the closing row without a MAX subquery. |

`seq` inside `events[]` stays **globally monotonic across the whole mount** (does not reset per segment), so event ordering is preserved end to end.

### Per-field aggregation semantics
Each row now describes **one segment**, not the whole visit. Consumers join on `instance_id` and aggregate:

| Field | Per-row meaning | How to aggregate a full visit |
|---|---|---|
| `dwell_ms` | duration of this segment (`ended_at_ms − started_at_ms`) | `SUM(dwell_ms)` |
| `started_at_ms` / `ended_at_ms` | segment boundaries | `MIN(started_at_ms)`, `MAX(ended_at_ms)` |
| `render_cost.commit_count`, `total_render_ms`, `slow_render_count` | delta this segment | `SUM(...)` |
| `render_cost.max_render_ms`, `api_cost.max_latency_ms` | max within segment | `MAX(...)` |
| `render_cost.mount_to_first_paint_ms` | set on `flush_seq = 1` only; `null` after | take the non-null value |
| `api_cost.call_count`, `success_count`, `error_count`, `total_latency_ms` | delta this segment | `SUM(...)` |
| `api_cost.avg_latency_ms` | segment average (informational) | recompute: `SUM(total_latency_ms) / NULLIF(SUM(call_count), 0)` |
| `interaction_cost.*` counts | delta this segment | `SUM(...)` |
| `interaction_cost.unique_fields_visited` | distinct within segment | **not summable** — true distinct needs raw field events; document as approximate |
| `events[]` | events in this segment | `UNION` / concatenate ordered by `seq` |

**Note the two non-summable cases** (`unique_fields_visited`, and any distinct-count) explicitly in the schema so analysts don't `SUM` them by accident.

### Why delta over cumulative
Bounded memory and payload per segment is the entire reason the 60s timer exists; a cumulative model defeats it and reintroduces the 1MB/413 risk on long sessions. The cost is slightly more complex queries, which the `is_final` flag and `instance_id` join key keep manageable.

---

## Rule 2 — Top-level `status` and `log_severity` are derived, server-authoritative

### The problem
The §6 sample carries a nested 500 (`error_count: 1`) but reports top-level `status: true`, `log_severity: "INFO"`. That's internally contradictory, and with no rule two implementers will compute it two different ways.

### Severity ladder
```
INFO  <  WARN  <  ERROR  <  FATAL
```

### Proposed rules
For any bundled event (`COMPONENT_SESSION`), computed **per row/segment**:

- **`log_severity`** = the maximum severity across all nested `events[]` in that row, defaulting to `INFO` when there are none.
- **`status`** = `false` if `log_severity ≥ ERROR`, otherwise `true`.

### Truth table
| Segment contains | `log_severity` | `status` | Rationale |
|---|---|---|---|
| only successful events | `INFO` | `true` | clean |
| a form `validation_error` (WARN) | `WARN` | `true` | user input mistake ≠ system failure |
| a 4xx/5xx API call (ERROR) | `ERROR` | `false` | technical failure |
| a crash surfaced in-bundle (FATAL) | `FATAL` | `false` | technical failure |

This deliberately keeps `status: true` when the only issue is a client-side validation warning — a mistyped field is not a failed session — while flipping `status: false` on any real ERROR/FATAL.

### Authority & consistency
- The **server recomputes** both fields from `events[]` and overrides whatever the client sent. Telemetry payloads are untrusted; deriving server-side guarantees `status`, `log_severity`, and `api_cost.error_count` never disagree.
- Consistency invariant to assert in validation: `api_cost.error_count > 0` ⟺ at least one nested event with `status = false` ⟺ `log_severity ≥ ERROR` ⟺ `status = false`.

### Full-visit roll-up (with Rule 1)
Across all rows for an `instance_id`:
- visit-level severity = `MAX(log_severity)` (map to the ladder, take the highest),
- visit had a failure = `LOGICAL_OR(NOT status)` / `MAX(error_count) > 0`.

---

## Summary of changes to request

1. Adopt the **delta flush model**; add `flush_seq` and `is_final` to `component`.
2. Document the non-summable fields (`unique_fields_visited`).
3. Adopt **derived, server-authoritative** `status` / `log_severity` with the ladder and truth table above.
4. Add the consistency invariant to backend Joi validation.

Both rules are additive to v1.0 and don't change the envelope or the fan-out design.
