import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './CertificatePreview.css';

function BilingualRow({ labelEn, valueEn, valueUr, labelUr, className = '', ltrValue = false }) {
  return (
    <div className={`cert-row ${className}`}>
      <div className="cert-row-en">
        <span className="cert-label-en">{labelEn}</span>
        <span className="cert-value-en">{valueEn}</span>
      </div>
      <div className="cert-row-ur">
        {/* Urdu is RTL, so the label needs to come FIRST in source order —
            in an RTL flex row the first child sits at the right (closest
            to the outer edge / the reference's label position), with
            later children flowing to its left toward the divider. */}
        <span className="cert-label-ur">{labelUr}</span>
        {/* Dates like "10-Sep-2025" mix strong-LTR letters ("Sep") with
            digits and hyphens. Left unmarked inside an RTL container,
            the browser's bidi algorithm can reorder those hyphen-
            separated segments (rendering it as "Sep-2025-10"). Forcing
            an isolated LTR run keeps the date in its actual order. */}
        <span className={`cert-value-ur${ltrValue ? ' cert-value-ltr' : ''}`}>{valueUr}</span>
      </div>
    </div>
  );
}

function CnicRow({ labelEn, valueEn, labelUr, className = '' }) {
  return (
    <div className={`cert-row ${className}`}>
      <div className="cert-row-en">
        <span className="cert-label-en">{labelEn}</span>
        <span className="cert-value-en">{valueEn}</span>
      </div>
      <div className="cert-row-ur cnic-row-ur">
        <span className="cert-label-ur cert-urdu-typesetting">{labelUr}</span>
        <span className="cert-value-ur cert-cnic-ur">{valueEn}</span>
      </div>
    </div>
  );
}

const CertificatePreview = forwardRef(function CertificatePreview({ data }, ref) {
  return (
    <div className="certificate-page" ref={ref}>
      <img
        src="/assets/extracted_img_0.png"
        alt=""
        className="cert-watermark"
        aria-hidden="true"
      />

      <header className="cert-header">
        <div className="cert-logo-slot">
          <img
            src="/assets/extracted_img_1.png"
            alt="Government of Punjab"
            className="cert-logo"
          />
        </div>

        <div className="cert-titles">
          <div className="cert-title-ur">حکومت پنجاب پاکستان</div>
          <div className="cert-subtitle-en">GOVERNMENT OF THE PUNJAB PAKISTAN</div>
          <div className="cert-main-title-ur">اندراج پیدائش سرٹیفکیٹ</div>
          <div className="cert-main-title-en">Birth Registration Certificate</div>
        </div>

        <div className="cert-barcode-wrap">
          <img
            src="/assets/extracted_img_2.png"
            alt="Barcode"
            className="cert-barcode"
          />
        </div>
      </header>

      <div className="cert-meta">
        <div className="cert-meta-left">
          <div>Tracking Id : {data.trackingId}</div>
          <div>CRMS No. : {data.crmsNo}</div>
          <div>OLD/M REG # : {data.oldRegNo}</div>
        </div>
        <div className="cert-meta-right">
          {/* "دفتراندراج" (Registration Office) is a label for
              officeBlock — same RTL label-then-value pattern as the rest
              of the form, so the label sits at the far right and the
              value trails toward the middle, instead of the label
              floating in its own centered column like before. */}
          <div className="cert-meta-office">
            <span className="cert-office-reg">دفتراندراج :</span>
            <span className="cert-office-value">{data.officeBlock}</span>
          </div>
          {data.oldCrmsNo ? <div>Old CRMS No. : {data.oldCrmsNo}</div> : <div>Old CRMS No. :</div>}
        </div>
      </div>

      <section className="cert-section">
        <div className="cert-section-header">
          <div className="cert-section-title-box">
            <span className="cert-section-title-en">Child&apos;s Details</span>
            <span className="cert-section-title-ur">بچے کے کوائف</span>
          </div>
        </div>
        <div className="cert-section-body">
          <BilingualRow
            labelEn="Name :"
            valueEn={data.childNameEn}
            valueUr={data.childNameUr}
            labelUr="نام :"
          />
          <BilingualRow
            labelEn="Date of Birth :"
            valueEn={data.dateOfBirth}
            valueUr={data.dateOfBirth}
            labelUr="تاریخ :"
            ltrValue
          />
          <div className="cert-row cert-row-split">
            {/* Gender and Religion share the ordinary 50% English column
                (same as every other row) instead of carving out a wider
                custom split — the reference keeps the English/Urdu
                divider at the same x position on every row, and giving
                this row its own wider share made the divider line jog
                sideways just for this one row. */}
            <div className="cert-row-en">
              {/* Gender's label keeps the SAME fixed width as every
                  other label in the form, so "Male"/"Female" lines up
                  in the same column as "Muhammad Hussain", the dates,
                  etc. Religion is then its own separate field/column
                  right after it, with a clear gap — mirrored below on
                  the Urdu side. */}
              <span className="cert-label-en">Gender :</span>
              <span className="cert-value-en split-gender-value-en">{data.genderEn}</span>
              <span className="cert-label-en split-gap-en">Religion :</span>
              <span className="cert-value-en split-value-en">{data.religionEn}</span>
            </div>
            <div className="cert-row-ur">
              {/* Mirrors the English side (Gender first/outer, Religion
                  second/inner): in RTL, first child = rightmost = closest
                  to the outer edge, so Gender's label+value come first. */}
              <span className="cert-label-ur">جنس :</span>
              <span className="cert-value-ur split-gender-value-ur">{data.genderUr}</span>
              <span className="cert-label-ur split-gap-ur">مذہب :</span>
              <span className="cert-value-ur split-value-ur">{data.religionUr}</span>
            </div>
          </div>
          <BilingualRow
            labelEn="District of Birth:"
            valueEn={data.districtOfBirthEn}
            valueUr={data.districtOfBirthUr}
            labelUr="پیدائش کا ضلع :"
            className="district-row"
          />
        </div>
      </section>

      <section className="cert-section">
        <div className="cert-section-header">
          <div className="cert-section-title-box">
            <span className="cert-section-title-en">Parental Information</span>
            <span className="cert-section-title-ur">والدین کے کوائف</span>
          </div>
        </div>
        <div className="cert-section-body">
          <BilingualRow
            labelEn="Father's Name :"
            valueEn={data.fatherNameEn}
            valueUr={data.fatherNameUr}
            labelUr="والد کا نام :"
          />
          <BilingualRow
            labelEn="Natonality :"
            valueEn={data.fatherNationalityEn}
            valueUr={data.fatherNationalityUr}
            labelUr="قومیت :"
          />
          <CnicRow labelEn="CNIC No :" valueEn={data.fatherCnic} labelUr="شناخت کارڈ :" />
          <BilingualRow
            labelEn="Mother's Name :"
            valueEn={data.motherNameEn}
            valueUr={data.motherNameUr}
            labelUr="والدہ کا نام :"
          />
          <BilingualRow
            labelEn="Natonality :"
            valueEn={data.motherNationalityEn}
            valueUr={data.motherNationalityUr}
            labelUr="قومیت :"
          />
          <CnicRow labelEn="CNIC No :" valueEn={data.motherCnic} labelUr="شناخت کارڈ :" />
          <BilingualRow
            labelEn="Grand Father's Name :"
            valueEn={data.grandfatherNameEn}
            valueUr={data.grandfatherNameUr}
            labelUr="دادا کا نام :"
          />
          <CnicRow labelEn="CNIC No :" valueEn={data.grandfatherCnic} labelUr="شناختی کارڈ :" />
        </div>
      </section>

      <section className="cert-section">
        <div className="cert-section-header">
          <div className="cert-section-title-box">
            <span className="cert-section-title-en">Address</span>
            <span className="cert-section-title-ur">پتہ</span>
          </div>
        </div>
        <div className="cert-section-body">
          <div className="cert-row address-row">
            <div className="cert-row-en">
              <span className="cert-label-en">Address :</span>
              <span className="cert-value-en cert-address">{data.addressEn}</span>
            </div>
            <div className="cert-row-ur">
              <span className="cert-label-ur">پتہ :</span>
              <span className="cert-value-ur cert-address-ur">{data.addressUr}</span>
            </div>
          </div>
          <BilingualRow labelEn="Tehsil :" valueEn={data.tehsilEn} valueUr={data.tehsilUr} labelUr="تحصیل :" />
          <BilingualRow labelEn="District :" valueEn={data.districtEn} valueUr={data.districtUr} labelUr="ضلع :" />
        </div>
      </section>

      <section className="cert-section">
        <div className="cert-section-header">
          <div className="cert-section-title-box">
            <span className="cert-section-title-en">Applicant&apos;s Details</span>
            <span className="cert-section-title-ur">درخواست دہندہ کے کوائف</span>
          </div>
        </div>
        <div className="cert-section-body">
          <BilingualRow labelEn="Name :" valueEn={data.applicantNameEn} valueUr={data.applicantNameUr} labelUr="نام :" />
          <CnicRow labelEn="CNIC No :" valueEn={data.applicantCnic} labelUr="شناخت کارڈ :" />
          <BilingualRow
            labelEn="Relaton of Child :"
            valueEn={data.relationEn}
            valueUr={data.relationUr}
            labelUr="بچے کا رشتہ :"
          />
        </div>
      </section>

      <div className="cert-footer-rows">
        <BilingualRow labelEn="Entry Date :" valueEn={data.entryDate} valueUr={data.entryDate} labelUr="تاریخ اندراج :" ltrValue />
        <BilingualRow labelEn="Issue Date :" valueEn={data.issueDate} valueUr={data.issueDate} labelUr="تاریخ اجراء :" ltrValue />
        <BilingualRow
          labelEn="Entry Status :"
          valueEn={data.entryStatusEn}
          valueUr={data.entryStatusUr}
          labelUr="اندراج اسٹیٹس :"
        />
      </div>

      <div className="cert-bottom">
        <div className="cert-signature-block">
          <div className="cert-signature-line">-------------------- دستخط</div>
          <div className="cert-secretary cert-urdu-typesetting">
            {data.unionCouncilNo} {data.secretaryTitleUr}
          </div>
          <div className="cert-office-name">{data.officeUr}</div>
        </div>

        <div className="cert-qr">
          <QRCodeSVG value={data.qrValue || data.trackingId} size={72} level="M" />
        </div>
      </div>
    </div>
  );
});

export default CertificatePreview;
