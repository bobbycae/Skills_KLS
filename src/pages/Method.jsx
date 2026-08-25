import data from "../jobsData.json";
import { PageHead, Section } from "./ui.jsx";

const { meta, stats } = data;

const STEPS = [
  {
    n: "ขั้นที่ 1",
    title: "เก็บรายการประกาศ",
    body: "อ่านหน้ารายการของทั้งสามเว็บ JobThai อ่านจาก __NEXT_DATA__ ซึ่งฝังผล GraphQL ไว้ ส่วนอีกสองเว็บอ่านลิงก์จาก HTML ที่เรนเดอร์ฝั่งเซิร์ฟเวอร์",
    code: "npm run scrape:all",
  },
  {
    n: "ขั้นที่ 2",
    title: "ดึงเนื้อประกาศ",
    body: "เปิดหน้ารายละเอียดของแต่ละงานแล้วถอด HTML เป็นข้อความ เก็บเฉพาะช่วงที่เป็นหน้าที่งานและคุณสมบัติ ตัดส่วนหัวและท้ายเว็บออก",
    code: "scripts/lib.mjs · sliceJobBody()",
  },
  {
    n: "ขั้นที่ 3",
    title: "ยืนยันว่าอยู่ในกาฬสินธุ์",
    body: "ตรวจชื่อจังหวัดและอำเภอทั้ง 18 อำเภอในเนื้อประกาศ ประกาศที่ระบุเพียง “ภาคอีสาน” หรือจังหวัดอื่นจะถูกตัดออกจากฐานสถิติ",
    code: "KALASIN_PATTERN",
  },
  {
    n: "ขั้นที่ 4",
    title: "สกัดทักษะ",
    body: "จับคู่ข้อความกับทะเบียนทักษะ แยก Hard skill (ความรู้เชิงเทคนิคที่เรียนและวัดได้) ออกจาก Soft skill (ลักษณะส่วนบุคคลที่ใช้ข้ามสายงานได้) ตามเกณฑ์ Indeed ส่วนวุฒิและประสบการณ์แยกเป็นคุณสมบัติ ไม่ปนกับทักษะ",
    code: "scripts/skill-taxonomy-th.mjs",
  },
  {
    n: "ขั้นที่ 5",
    title: "รวมและสรุปสถิติ",
    body: "รวมประกาศซ้ำข้ามเว็บด้วยชื่อตำแหน่งและบริษัทที่ตัดอักขระพิเศษออก แล้วคำนวณสถิติจากฐานที่ยืนยันแล้วเท่านั้น",
    code: "npm run build:data",
  },
];

export default function Method() {
  return (
    <>
      <PageHead
        eyebrow="ระเบียบวิธี"
        title="เก็บข้อมูลอย่างไร และตัวเลขชุดนี้ตอบอะไรไม่ได้"
        lead="หน้านี้อธิบายขั้นตอนทั้งหมดและข้อจำกัดที่ทราบ เพื่อให้ผู้อ่านตัดสินได้เองว่าจะนำตัวเลขไปใช้กับคำถามแบบใดได้บ้าง"
      />

      <div className="wrap">
        <Section title="ขั้นตอนการสร้างข้อมูล">
          <div className="flow">
            {STEPS.map(step => (
              <div key={step.n} className="flowstep">
                <div className="n">{step.n}</div>
                <b>{step.title}</b>
                <p>{step.body}</p>
                <code>{step.code}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="หลักการนับ — แยกที่มาออกจากฐานที่ใช้คำนวณ"
          sub="เป็นหลักการเดียวกับที่เว็บหลักสูตรใช้แยก searchMatches ออกจาก classifiedMatches"
        >
          <div className="scroll-x">
            <table className="tbl">
              <thead>
                <tr><th>ชุดข้อมูล</th><th className="r">จำนวน</th><th>ใช้ทำอะไร</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>ประกาศที่เก็บมาทั้งหมด</td>
                  <td className="r mono">{meta.collected}</td>
                  <td className="mut">ใช้ตรวจสอบย้อนกลับว่าข้อมูลมาจากไหน <b>ไม่ใช้คำนวณสถิติ</b></td>
                </tr>
                <tr>
                  <td>ยืนยันว่าอยู่ในกาฬสินธุ์</td>
                  <td className="r mono">{meta.confirmedKalasin}</td>
                  <td className="mut">ฐานเดียวที่ใช้คำนวณจำนวนงานและสถิติทักษะทุกหน้า</td>
                </tr>
                <tr>
                  <td>มีเนื้อประกาศฉบับเต็ม</td>
                  <td className="r mono">{meta.withDescription}</td>
                  <td className="mut">
                    สกัดทักษะได้ครบทั้งเชิงเทคนิคและเชิงพฤติกรรม
                    {meta.withDescription === meta.confirmedKalasin && " — ครบทุกรายการ"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="แหล่งข้อมูลและสิ่งที่เก็บได้จริง">
          <div className="scroll-x">
            <table className="tbl">
              <thead>
                <tr>
                  <th>แหล่ง</th><th className="r">เก็บได้</th><th className="r">อยู่ในกาฬสินธุ์</th>
                  <th>ลักษณะและข้อจำกัด</th>
                </tr>
              </thead>
              <tbody>
                {meta.sources.map(source => (
                  <tr key={source.source}>
                    <td><b>{source.source}</b></td>
                    <td className="r mono">{source.collected}</td>
                    <td className="r mono">{source.inKalasin ?? source.collected}</td>
                    <td className="mut">{source.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="ข้อจำกัดที่ทราบ">
          <div className="note warn">
            <b>1. ไม่ใช่สำมะโนตลาดแรงงาน</b> — เก็บได้เฉพาะประกาศที่ลงบนสามเว็บนี้ในช่วงเวลาที่เก็บ
            งานจำนวนมากในกาฬสินธุ์โดยเฉพาะภาคเกษตร งานราชการ และธุรกิจครอบครัว
            ไม่เคยผ่านเว็บหางาน ตัวเลขนี้จึงเป็นภาพของ “ตลาดแรงงานที่ประกาศออนไลน์” เท่านั้น
          </div>
          <div className="note warn">
            <b>2. หน้ารายการไม่รองรับการแบ่งหน้าฝั่งเซิร์ฟเวอร์</b> — JOBBKK รายงานว่ามีประกาศในกาฬสินธุ์
            มากกว่าที่ส่งมากับ HTML และ JOBTOPGUN ละเลยพารามิเตอร์ page
            จึงชดเชยด้วยการไล่หน้าแยกตามสายงาน แต่ยังไม่ครบทุกประกาศที่เว็บรายงาน
          </div>
          <div className="note warn">
            <b>3. ผลค้นระดับภาคปนมากับผลระดับจังหวัด</b> — คำค้น “กาฬสินธุ์” ของ JOBTOPGUN
            คืนประกาศที่ระบุพื้นที่เป็น “ภาคอีสาน” เป็นส่วนใหญ่
            จึงตัดออก {data.excluded.length} รายการ ถ้านับรวมจะได้ภาพตลาดแรงงานที่เกินจริงหลายเท่า
          </div>
          <div className="note warn">
            <b>4. สกัดทักษะด้วยการจับคู่คำ ไม่ได้ใช้โมเดลภาษา</b> — {meta.skillMethod}
            วิธีนี้ตรวจจับคำที่อยู่ในทะเบียนได้แม่นยำ แต่จับทักษะที่เขียนด้วยถ้อยคำนอกทะเบียนไม่ได้
            และไม่เข้าใจบริบทเชิงปฏิเสธ เช่น “ไม่จำเป็นต้องมีประสบการณ์”
          </div>
        </Section>

        <Section title="การทำซ้ำ" sub="ทุกตัวเลขบนเว็บนี้สร้างใหม่ได้จากคำสั่งสามบรรทัด">
          <div className="scroll-x">
            <table className="tbl">
              <thead><tr><th>คำสั่ง</th><th>ผลลัพธ์</th></tr></thead>
              <tbody>
                <tr><td className="mono">npm run scrape:all</td><td className="mut">เก็บประกาศใหม่จากทั้งสามเว็บลงโฟลเดอร์ data/</td></tr>
                <tr><td className="mono">npm run build:data</td><td className="mut">รวมข้อมูล สกัดทักษะ และสร้าง src/jobsData.json</td></tr>
                <tr><td className="mono">npm run build</td><td className="mut">สร้างเว็บสแตติก โดยเรียก build:data ให้อัตโนมัติ</td></tr>
              </tbody>
            </table>
          </div>
          <p className="hint">
            เก็บข้อมูลครั้งล่าสุดเมื่อ {meta.capturedAt} · ทะเบียนทักษะมี{" "}
            {stats.technical.length} ทักษะเทคนิคที่พบจริง จากที่ประกาศไว้ในทะเบียนทั้งหมด
          </p>
        </Section>
      </div>
    </>
  );
}
