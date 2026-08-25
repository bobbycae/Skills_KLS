import { Link } from "react-router-dom";
import data from "../jobsData.json";
import { Section, SkillBar, CATEGORY_COLOR, CATEGORY_TH } from "./ui.jsx";

const { meta, stats } = data;
const topTechnical = stats.technical.slice(0, 10);
const maxCount = topTechnical[0]?.count || 1;

export default function Home() {
  return (
    <>
      <div className="hero">
        <div className="wrap">
          <div className="eyebrow">ข้อมูลตลาดแรงงานระดับจังหวัด</div>
          <h1>ตลาดแรงงานกาฬสินธุ์ต้องการทักษะอะไร</h1>
          <p className="lead">
            รวบรวมประกาศรับสมัครงานจริงจาก JobThai · JOBTOPGUN · JOBBKK
            แล้วสกัดทักษะที่ประกาศระบุออกมาเป็นสถิติ เพื่อใช้เป็นหลักฐานประกอบการออกแบบหลักสูตร
            และการแนะแนวอาชีพในพื้นที่
          </p>

          <div className="hero-stats">
            <div><b>{meta.confirmedKalasin}</b><span>ตำแหน่งในกาฬสินธุ์</span></div>
            <div><b>{meta.companies}</b><span>สถานประกอบการ</span></div>
            <div><b>{stats.technical.length}</b><span>ทักษะเทคนิคที่พบ</span></div>
            <div><b>{stats.districts.length}</b><span>อำเภอที่มีประกาศ</span></div>
            <div><b>{meta.collected}</b><span>ประกาศที่เก็บมาทั้งหมด</span></div>
          </div>

          <div className="hero-cta">
            <Link className="btn primary" to="/skills">ดูทักษะทั้งหมด</Link>
            <Link className="btn" to="/jobs">ดูตำแหน่งงาน</Link>
            <Link className="btn" to="/method">ระเบียบวิธีและข้อจำกัด</Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <Section
          title="Hard Skills ที่ประกาศงานต้องการมากที่สุด 10 อันดับ"
          sub={`นับจากประกาศ ${meta.confirmedKalasin} รายการที่ยืนยันว่าอยู่ในจังหวัดกาฬสินธุ์`}
        >
          <div>
            {topTechnical.map(skill => (
              <SkillBar key={skill.name} {...skill} max={maxCount}
                color={CATEGORY_COLOR[skill.category]} />
            ))}
          </div>
          <p className="hint">
            ร้อยละคือสัดส่วนของประกาศที่พบทักษะนั้น ประกาศหนึ่งรายการมีได้หลายทักษะ ผลรวมจึงเกิน 100%
          </p>
        </Section>

        <Section title="สัดส่วนตามหมวดงาน" sub="จำนวนประกาศที่ต้องการทักษะอย่างน้อยหนึ่งข้อในหมวดนั้น">
          <div className="catgrid">
            {stats.byCategory.filter(c => c.jobCount > 0).map(cat => (
              <div key={cat.category} className="catcard" style={{ "--cc": CATEGORY_COLOR[cat.category] }}>
                <h3>{cat.category}<small>{CATEGORY_TH[cat.category]}</small></h3>
                <div className="cnt">
                  {cat.jobCount} ประกาศ · {Math.round((cat.jobCount / meta.confirmedKalasin) * 100)}% ของทั้งหมด
                </div>
                <div className="tags">
                  {cat.skills.slice(0, 4).map(skill => (
                    <span key={skill.name} className="tag">{skill.name} · {skill.count}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="คุณสมบัติที่ประกาศระบุ" sub="วุฒิ ประสบการณ์ และเงื่อนไขอื่นที่นายจ้างกำหนด">
          <div className="scroll-x">
            <table className="tbl">
              <thead>
                <tr><th>คุณสมบัติ</th><th className="r">จำนวนประกาศ</th><th className="r">ร้อยละ</th></tr>
              </thead>
              <tbody>
                {stats.requirements.map(item => (
                  <tr key={item.name}>
                    <td>{item.name}<br /><small className="mut">{item.nameTh}</small></td>
                    <td className="r mono">{item.count}</td>
                    <td className="r mono">{item.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="กระจายตามอำเภอ">
          <div className="scroll-x">
            <table className="tbl">
              <thead><tr><th>อำเภอ</th><th className="r">จำนวนประกาศ</th></tr></thead>
              <tbody>
                {stats.districts.map(item => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td className="r mono">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="อ่านต่อ">
          <div className="cardgrid">
            <Link className="navcard" to="/skills">
              <div className="ic">◆</div>
              <b>ทักษะที่ต้องการ</b>
              <p>รายการทักษะเทคนิคและทักษะเชิงพฤติกรรมทั้งหมด แยกตามหมวดงาน พร้อมจำนวนประกาศที่พบ</p>
              <span className="go">เปิดดู →</span>
            </Link>
            <Link className="navcard" to="/jobs">
              <div className="ic">▣</div>
              <b>ตำแหน่งงาน</b>
              <p>ประกาศทั้ง {meta.confirmedKalasin} รายการ ค้นหาและกรองตามทักษะหรือแหล่งข้อมูลได้</p>
              <span className="go">เปิดดู →</span>
            </Link>
            <Link className="navcard" to="/method">
              <div className="ic">◈</div>
              <b>ระเบียบวิธีและข้อจำกัด</b>
              <p>เก็บข้อมูลอย่างไร นับอย่างไร และตัวเลขชุดนี้ใช้ตอบอะไรไม่ได้บ้าง</p>
              <span className="go">เปิดดู →</span>
            </Link>
          </div>
        </Section>

        <div className="note warn">
          <b>ข้อจำกัดที่ต้องอ่านก่อนใช้ตัวเลข</b> — เก็บประกาศมาทั้งหมด {meta.collected} รายการ
          แต่ยืนยันว่าอยู่ในกาฬสินธุ์จริงเพียง {meta.confirmedKalasin} รายการ
          ซึ่งสกัดทักษะจากเนื้อประกาศฉบับเต็มได้ครบทุกรายการ
          ตัวเลขนี้เป็นภาพของงานที่<b>ประกาศผ่านเว็บหางาน</b>ในช่วงเวลาหนึ่ง
          ไม่ใช่สำมะโนตลาดแรงงานทั้งจังหวัด
          รายละเอียดอยู่ในหน้า <Link className="lnk" to="/method">ระเบียบวิธีและข้อจำกัด</Link>
        </div>
      </div>
    </>
  );
}
