/* ส่วนประกอบร่วมของทุกหน้า ใช้คลาสชุดเดียวกับเว็บหลักสูตร */

export function PageHead({ eyebrow, title, lead }) {
  return (
    <div className="pagehead">
      <div className="wrap">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </div>
  );
}

export function Section({ title, sub, children, id }) {
  return (
    <section className="sect" id={id}>
      {title && <h2 className="sect-h">{title}{sub && <small>{sub}</small>}</h2>}
      {children}
    </section>
  );
}

/* แถบสัดส่วน — ความยาวคิดเทียบกับทักษะอันดับหนึ่ง ไม่ใช่เทียบ 100%
   เพราะไม่มีทักษะใดปรากฏในทุกประกาศ ถ้าเทียบ 100% แถบจะสั้นจนอ่านลำดับไม่ออก */
/* ชื่อทักษะแสดงเป็นภาษาอังกฤษให้เทียบกรอบสากลได้ โดยมีคำแปลไทยกำกับบรรทัดล่าง */
export function SkillBar({ name, nameTh, count, percent, max, color }) {
  return (
    <div className="skillrow">
      <div className="nm">{name}{nameTh && <small>{nameTh}</small>}</div>
      <div className="bar">
        <i style={{ width: `${Math.max(3, (count / max) * 100)}%`, "--bc": color }} />
      </div>
      <div className="pc">{percent}%</div>
    </div>
  );
}

export const CATEGORY_COLOR = {
  "Sales & Marketing": "var(--c1)",
  "Business & Finance": "var(--c2)",
  "Engineering & Manufacturing": "var(--c3)",
  "Computer & Digital": "var(--c5)",
  "Supply Chain & Logistics": "var(--c6)",
  "Applied Sciences": "var(--c4)",
  "Soft Skills": "var(--gold)",
};

/* คำแปลหมวดสำหรับหัวข้อบนหน้าเว็บ */
export const CATEGORY_TH = {
  "Sales & Marketing": "งานขายและการตลาด",
  "Business & Finance": "ธุรกิจและการเงิน",
  "Engineering & Manufacturing": "วิศวกรรมและการผลิต",
  "Computer & Digital": "คอมพิวเตอร์และดิจิทัล",
  "Supply Chain & Logistics": "ซัพพลายเชนและโลจิสติกส์",
  "Applied Sciences": "วิทยาศาสตร์ประยุกต์และวิชาชีพเฉพาะ",
  "Soft Skills": "ทักษะเชิงพฤติกรรม",
};
