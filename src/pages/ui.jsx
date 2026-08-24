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
export function SkillBar({ name, category, count, percent, max, color }) {
  return (
    <div className="skillrow">
      <div className="nm">{name}{category && <small>{category}</small>}</div>
      <div className="bar">
        <i style={{ width: `${Math.max(3, (count / max) * 100)}%`, "--bc": color }} />
      </div>
      <div className="pc">{percent}%</div>
    </div>
  );
}

export const CATEGORY_COLOR = {
  "การขายและการตลาด": "var(--c1)",
  "บัญชีและการเงิน": "var(--c2)",
  "การผลิตและวิศวกรรม": "var(--c3)",
  "ดิจิทัลและไอที": "var(--c5)",
  "โลจิสติกส์": "var(--c6)",
  "เกษตรและอาหาร": "var(--c4)",
  "บริการและสุขภาพ": "var(--c7)",
  "ทักษะเชิงพฤติกรรม": "var(--gold)",
};
