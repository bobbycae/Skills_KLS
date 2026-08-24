import { useState } from "react";
import data from "../jobsData.json";
import { PageHead, Section, SkillBar, CATEGORY_COLOR } from "./ui.jsx";

const { meta, stats } = data;
const ALL = "ทั้งหมด";
const categories = [ALL, ...stats.byCategory.filter(c => c.skills.length).map(c => c.category)];

export default function Skills() {
  const [active, setActive] = useState(ALL);

  const technical = active === ALL
    ? stats.technical
    : stats.technical.filter(skill => skill.category === active);
  const maxTechnical = stats.technical[0]?.count || 1;
  const maxSoft = stats.soft[0]?.count || 1;

  return (
    <>
      <PageHead
        eyebrow="ผลการสกัดทักษะ"
        title="ทักษะที่ประกาศงานในกาฬสินธุ์ต้องการ"
        lead={`สกัดจากชื่อตำแหน่งและเนื้อประกาศของงาน ${meta.confirmedKalasin} รายการ ด้วยทะเบียนทักษะภาษาไทยที่เขียนขึ้นสำหรับตลาดแรงงานระดับจังหวัดโดยเฉพาะ`}
      />

      <div className="wrap">
        <Section title="ทักษะเชิงเทคนิค" sub="เรียงตามจำนวนประกาศที่พบทักษะนั้น">
          <div className="filters">
            {categories.map(category => (
              <button
                key={category}
                className={`btn${active === category ? " on" : ""}`}
                onClick={() => setActive(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {technical.length === 0 && <p className="hint">ไม่พบทักษะในหมวดนี้</p>}
          <div>
            {technical.map(skill => (
              <SkillBar key={skill.name} {...skill} max={maxTechnical}
                color={CATEGORY_COLOR[skill.category]} />
            ))}
          </div>
        </Section>

        <Section
          title="ทักษะเชิงพฤติกรรม"
          sub={`ใช้ชุดเดียวกันทุกสายงานเพื่อให้เทียบข้ามอาชีพได้ · พบได้เฉพาะในประกาศที่มีเนื้อหาฉบับเต็ม ${meta.withDescription} รายการ`}
        >
          <div>
            {stats.soft.map(skill => (
              <SkillBar key={skill.name} {...skill} max={maxSoft} color="var(--gold)" />
            ))}
          </div>
          <div className="note warn">
            <b>ตัวเลขในส่วนนี้ต่ำกว่าความเป็นจริง</b> — ทักษะเชิงพฤติกรรมแทบไม่ปรากฏในชื่อตำแหน่ง
            แต่ประกาศที่เก็บเนื้อหาฉบับเต็มได้มีเพียง {meta.withDescription} จาก {meta.confirmedKalasin} รายการ
            ({Math.round((meta.withDescription / meta.confirmedKalasin) * 100)}%)
            จึงควรอ่านเป็นลำดับความสำคัญเชิงเปรียบเทียบ ไม่ใช่สัดส่วนที่แท้จริงของตลาด
          </div>
        </Section>

        <Section title="ทักษะแยกตามหมวดงาน" sub="หมวดที่มีประกาศมากที่สุดอยู่บนสุด">
          <div className="catgrid">
            {stats.byCategory.filter(c => c.skills.length).map(cat => (
              <div key={cat.category} className="catcard" style={{ "--cc": CATEGORY_COLOR[cat.category] }}>
                <h3>{cat.category}</h3>
                <div className="cnt">{cat.jobCount} ประกาศ · {cat.skills.length} ทักษะ</div>
                <div className="scroll-x">
                  <table className="tbl">
                    <thead><tr><th>ทักษะ</th><th className="r">ประกาศ</th></tr></thead>
                    <tbody>
                      {cat.skills.map(skill => (
                        <tr key={skill.name}>
                          <td>{skill.name}</td>
                          <td className="r mono">{skill.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
