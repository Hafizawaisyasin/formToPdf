import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './CertificatePreview.css';

function BilingualRow({ labelEn, valueEn, valueUr, labelUr, className = '' }) {
  return (
    <div className={`cert-row ${className}`}>
      <div className="cert-row-en">
        <span className="cert-label-en">{labelEn}</span>
        <span className="cert-value-en">{valueEn}</span>
      </div>
      <div className="cert-row-ur">
        <span className="cert-value-ur">{valueUr}</span>
        <span className="cert-label-ur">{labelUr}</span>
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
        <span className="cert-value-ur cert-cnic-ur">{valueEn}</span>
        <span className="cert-label-ur cert-urdu-typesetting">{labelUr}</span>
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
        <div className="cert-meta-center">
          <span className="cert-office-reg">دفتراندراج</span>
          <span className="cert-office-colon">:</span>
        </div>
        <div className="cert-meta-right">
          <div>{data.officeBlock}</div>
          {data.oldCrmsNo ? <div>Old CRMS No. : {data.oldCrmsNo}</div> : <div>Old CRMS No. :</div>}
        </div>
      </div>

      <section className="cert-section">
        <div className="cert-section-header">
          <span className="cert-section-title-en">Child&apos;s Details</span>
          <span className="cert-section-title-ur">بچے کے کوائف</span>
        </div>
        <div className="cert-section-body">
          <BilingualRow
            labelEn="Name :"
            valueEn={data.childNameEn}
            valueUr={data.childNameUr}
            labelUr=": نام"
          />
          <BilingualRow
            labelEn="Date of Birth :"
            valueEn={data.dateOfBirth}
            valueUr={data.dateOfBirth}
            labelUr=": تاریخ"
          />
          <div className="cert-row cert-row-split">
            <div className="cert-row-en split-left">
              <span className="cert-label-en">Gender :</span>
              <span className="cert-value-en">{data.genderEn}</span>
            </div>
            <div className="cert-row-en split-middle">
              <span className="cert-label-en">Religion :</span>
              <span className="cert-value-en">{data.religionEn}</span>
            </div>
            <div className="cert-row-ur split-right">
              <span className="cert-value-ur">{data.religionUr}</span>
              <span className="cert-label-ur">مذہب :</span>
              <span className="cert-value-ur gender-ur">{data.genderUr}</span>
              <span className="cert-label-ur">: جنس</span>
            </div>
          </div>
          <BilingualRow
            labelEn="District of Birth:"
            valueEn={data.districtOfBirthEn}
            valueUr={data.districtOfBirthUr}
            labelUr=": پیدائش کا ضلع"
            className="district-row"
          />
        </div>
      </section>

      <section className="cert-section">
        <div className="cert-section-header">
          <span className="cert-section-title-en">Parental Information</span>
          <span className="cert-section-title-ur">والدین کے کوائف</span>
        </div>
        <div className="cert-section-body">
          <BilingualRow
            labelEn="Father's Name :"
            valueEn={data.fatherNameEn}
            valueUr={data.fatherNameUr}
            labelUr=": والد کا نام"
          />
          <BilingualRow
            labelEn="Natonality :"
            valueEn={data.fatherNationalityEn}
            valueUr={data.fatherNationalityUr}
            labelUr="قومیت :"
          />
          <CnicRow labelEn="CNIC No :" valueEn={data.fatherCnic} labelUr=":  شناخت کارڈ" />
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
            labelUr=": قومیت"
          />
          <CnicRow labelEn="CNIC No :" valueEn={data.motherCnic} labelUr=":  شناخت کارڈ" />
          <BilingualRow
            labelEn="Grand Father's Name :"
            valueEn={data.grandfatherNameEn}
            valueUr={data.grandfatherNameUr}
            labelUr="دادا کا نام :"
          />
          <CnicRow labelEn="CNIC No :" valueEn={data.grandfatherCnic} labelUr=":  شناختی کارڈ" />
        </div>
      </section>

      <section className="cert-section">
        <div className="cert-section-header">
          <span className="cert-section-title-en">Address</span>
          <span className="cert-section-title-ur">پتہ</span>
        </div>
        <div className="cert-section-body">
          <div className="cert-row address-row">
            <div className="cert-row-en">
              <span className="cert-label-en">Address :</span>
              <span className="cert-value-en cert-address">{data.addressEn}</span>
            </div>
            <div className="cert-row-ur">
              <span className="cert-value-ur cert-address-ur">{data.addressUr}</span>
              <span className="cert-label-ur">: پتہ</span>
            </div>
          </div>
          <BilingualRow labelEn="Tehsil :" valueEn={data.tehsilEn} valueUr={data.tehsilUr} labelUr="تحصیل :" />
          <BilingualRow labelEn="District :" valueEn={data.districtEn} valueUr={data.districtUr} labelUr="ضلع :" />
        </div>
      </section>

      <section className="cert-section">
        <div className="cert-section-header">
          <span className="cert-section-title-en">Applicant&apos;s Details</span>
          <span className="cert-section-title-ur">درخواست دہندہ کے کوائف</span>
        </div>
        <div className="cert-section-body">
          <BilingualRow labelEn="Name :" valueEn={data.applicantNameEn} valueUr={data.applicantNameUr} labelUr=": نام" />
          <CnicRow labelEn="CNIC No :" valueEn={data.applicantCnic} labelUr=":  شناخت کارڈ" />
          <BilingualRow
            labelEn="Relaton of Child :"
            valueEn={data.relationEn}
            valueUr={data.relationUr}
            labelUr="بچے کا رشتہ :"
          />
        </div>
      </section>

      <div className="cert-footer-rows">
        <BilingualRow labelEn="Entry Date :" valueEn={data.entryDate} valueUr={data.entryDate} labelUr="تاریخ اندراج :" />
        <BilingualRow labelEn="Issue Date :" valueEn={data.issueDate} valueUr={data.issueDate} labelUr=":   تاریخ   اجراء" />
        <BilingualRow
          labelEn="Entry Status :"
          valueEn={data.entryStatusEn}
          valueUr={data.entryStatusUr}
          labelUr="  اندراج   اسٹیٹس"
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
