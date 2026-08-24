/* ทะเบียนทักษะสำหรับตลาดแรงงานทั่วไปในจังหวัดกาฬสินธุ์
 *
 * ต่างจาก skill-taxonomy.mjs ของ curriculum-graph ตรงที่ชุดนั้นออกแบบมาสำหรับสาย AI
 * โดยเฉพาะ (Python, MLOps, LLM) ซึ่งแทบไม่ปรากฏในประกาศงานระดับจังหวัด
 * ชุดนี้จึงครอบคลุมงานที่พบจริงในกาฬสินธุ์ — ขาย ผลิต บัญชี ขนส่ง เกษตร บริการ
 *
 * แต่ละทักษะจับคู่ด้วย pattern ภาษาไทยและอังกฤษ เพราะประกาศงานไทยผสมสองภาษาเสมอ
 * pattern เขียนเป็น RegExp source โดยไม่ใส่ \b รอบคำไทย เนื่องจากภาษาไทยไม่มีการเว้นวรรคระหว่างคำ
 * จึงใช้ \b เฉพาะกับคำอังกฤษเพื่อกันการจับคำซ้อน เช่น "SAP" ใน "SAPPHIRE"
 */

const en = word => `\\b${word}\\b`;

/* ---------- ทักษะเชิงเทคนิค แยกตามหมวดงาน ---------- */

export const TECHNICAL_SKILLS = [
  /* — ดิจิทัลและไอที — */
  { name: "Microsoft Office", category: "ดิจิทัลและไอที", patterns: ["ไมโครซอฟท์ ?ออฟฟิศ", "โปรแกรมสำเร็จรูป", en("MS Office"), en("Microsoft Office"), en("Word"), en("PowerPoint")] },
  { name: "Excel และการจัดการข้อมูล", category: "ดิจิทัลและไอที", patterns: ["เอ็กเซล", "ตารางคำนวณ", en("Excel"), en("Spreadsheet"), en("VLOOKUP"), en("Pivot")] },
  { name: "คอมพิวเตอร์พื้นฐาน", category: "ดิจิทัลและไอที", patterns: ["ใช้คอมพิวเตอร์", "คอมพิวเตอร์เบื้องต้น", "คอมพิวเตอร์ได้ดี", en("Computer literacy"), en("Basic computer")] },
  { name: "ระบบ ERP และ SAP", category: "ดิจิทัลและไอที", patterns: ["ระบบ ?ERP", en("ERP"), en("SAP"), en("Oracle"), en("Navision"), en("Dynamics")] },
  { name: "การพัฒนาซอฟต์แวร์", category: "ดิจิทัลและไอที", patterns: ["เขียนโปรแกรม", "พัฒนาโปรแกรม", "นักพัฒนา", en("Programming"), en("Developer"), en("Java"), en("Python"), en("PHP"), en("Flutter"), en("React")] },
  { name: "ฐานข้อมูลและ SQL", category: "ดิจิทัลและไอที", patterns: ["ฐานข้อมูล", en("SQL"), en("Database"), en("MySQL")] },
  { name: "ดูแลระบบเครือข่ายและ IT Support", category: "ดิจิทัลและไอที", patterns: ["ดูแลระบบ", "ซ่อมคอมพิวเตอร์", "ระบบเครือข่าย", en("IT Support"), en("Network"), en("Helpdesk"), en("System Admin")] },
  { name: "การตลาดดิจิทัลและโซเชียลมีเดีย", category: "ดิจิทัลและไอที", patterns: ["การตลาดออนไลน์", "สื่อออนไลน์", "โซเชียล ?มีเดีย", "ยิงแอด", "เพจ", en("Digital Marketing"), en("Social Media"), en("Facebook"), en("TikTok"), en("SEO")] },
  { name: "ออกแบบกราฟิกและตัดต่อ", category: "ดิจิทัลและไอที", patterns: ["ออกแบบกราฟิก", "ตัดต่อ", "กราฟฟิก", en("Photoshop"), en("Illustrator"), en("Canva"), en("Premiere"), en("Graphic Design")] },

  /* — การขายและการตลาด — */
  { name: "งานขายและปิดการขาย", category: "การขายและการตลาด", patterns: ["งานขาย", "พนักงานขาย", "ปิดการขาย", "เสนอขาย", "ยอดขาย", en("Sales"), en("Selling")] },
  { name: "การหาลูกค้าใหม่และขยายตลาด", category: "การขายและการตลาด", patterns: ["หาลูกค้า", "ขยายตลาด", "ขยายฐานลูกค้า", "เปิดลูกค้าใหม่", en("New customer"), en("Business Development"), en("Lead generation")] },
  { name: "การดูแลความสัมพันธ์ลูกค้า", category: "การขายและการตลาด", patterns: ["ดูแลลูกค้า", "รักษาฐานลูกค้า", "ความสัมพันธ์ลูกค้า", en("Customer Relationship"), en("CRM"), en("Account Management")] },
  { name: "การนำเสนอและเจรจาต่อรอง", category: "การขายและการตลาด", patterns: ["นำเสนอ", "เจรจาต่อรอง", "ต่อรอง", en("Presentation"), en("Negotiation")] },
  { name: "การวางแผนการตลาด", category: "การขายและการตลาด", patterns: ["วางแผนการตลาด", "กลยุทธ์การตลาด", "ส่งเสริมการขาย", en("Marketing plan"), en("Marketing strategy"), en("Promotion")] },
  { name: "งานขายหน้าร้านและบริการลูกค้า", category: "การขายและการตลาด", patterns: ["หน้าร้าน", "ประจำสาขา", "เชียร์สินค้า", "แคชเชียร์", en("Cashier"), en("Retail"), en("Shop")] },

  /* — บัญชี การเงิน และธุรการ — */
  { name: "บัญชีและงบการเงิน", category: "บัญชีและการเงิน", patterns: ["บัญชี", "งบการเงิน", "งบดุล", "ลงบัญชี", en("Accounting"), en("Bookkeeping"), en("Financial statement")] },
  { name: "ภาษีอากร", category: "บัญชีและการเงิน", patterns: ["ภาษี", "ภ\\.ง\\.ด", "ภ\\.พ\\.", "สรรพากร", en("Tax"), en("VAT"), en("Withholding")] },
  { name: "การเงินและสินเชื่อ", category: "บัญชีและการเงิน", patterns: ["สินเชื่อ", "การเงิน", "เร่งรัดหนี้", "บัตรเครดิต", "ประกันภัย", en("Finance"), en("Credit"), en("Loan"), en("Insurance")] },
  { name: "จัดซื้อและจัดหา", category: "บัญชีและการเงิน", patterns: ["จัดซื้อ", "จัดหา", "ซัพพลายเออร์", en("Purchasing"), en("Procurement"), en("Sourcing")] },
  { name: "งานธุรการและเอกสาร", category: "บัญชีและการเงิน", patterns: ["ธุรการ", "งานเอกสาร", "จัดเก็บเอกสาร", "ประสานงาน", en("Admin"), en("Administrative"), en("Documentation"), en("Clerical")] },
  /* ห้ามใช้ "เงินเดือน" หรือ "ฝึกอบรม" ลอย ๆ เพราะประกาศเกือบทุกฉบับมีคำเหล่านี้
     ในหัวข้อสวัสดิการ ("การปรับเงินเดือนประจำปี" · "การฝึกอบรมและพัฒนาพนักงาน") */
  { name: "งานบุคคลและสรรหา", category: "บัญชีและการเงิน", patterns: ["ทรัพยากรบุคคล", "งานบุคคล", "ฝ่ายบุคคล", "สรรหาบุคลากร", "สรรหาว่าจ้าง", "จัดฝึกอบรม", "งานเงินเดือน", en("HR"), en("Human Resource"), en("Recruitment"), en("Payroll")] },

  /* — การผลิตและวิศวกรรม — */
  { name: "ควบคุมการผลิต", category: "การผลิตและวิศวกรรม", patterns: ["ควบคุมการผลิต", "กระบวนการผลิต", "สายการผลิต", "วางแผนการผลิต", en("Production"), en("Manufacturing"), en("Process control")] },
  { name: "ควบคุมคุณภาพ QA/QC", category: "การผลิตและวิศวกรรม", patterns: ["ควบคุมคุณภาพ", "ตรวจสอบคุณภาพ", "ประกันคุณภาพ", en("QA"), en("QC"), en("Quality Control"), en("Quality Assurance")] },
  { name: "ซ่อมบำรุงเครื่องจักร", category: "การผลิตและวิศวกรรม", patterns: ["ซ่อมบำรุง", "บำรุงรักษา", "ซ่อมเครื่องจักร", "ช่างซ่อม", en("Maintenance"), en("Repair"), en("Mechanic")] },
  { name: "ระบบไฟฟ้าและอิเล็กทรอนิกส์", category: "การผลิตและวิศวกรรม", patterns: ["ไฟฟ้า", "อิเล็กทรอนิกส์", "ช่างไฟ", "ระบบไฟ", en("Electrical"), en("Electronic"), en("PLC")] },
  { name: "งานเครื่องกลและงานเชื่อม", category: "การผลิตและวิศวกรรม", patterns: ["เครื่องกล", "งานเชื่อม", "ช่างกล", "ช่างเชื่อม", "กลึง", en("Mechanical"), en("Welding"), en("CNC")] },
  { name: "งานก่อสร้างและโยธา", category: "การผลิตและวิศวกรรม", patterns: ["ก่อสร้าง", "โยธา", "ผู้รับเหมา", "หน้างาน", "ถอดแบบ", en("Construction"), en("Civil"), en("Site")] },
  { name: "เขียนแบบและ AutoCAD", category: "การผลิตและวิศวกรรม", patterns: ["เขียนแบบ", "อ่านแบบ", en("AutoCAD"), en("CAD"), en("SolidWorks"), en("Drawing")] },
  { name: "ความปลอดภัยและอาชีวอนามัย", category: "การผลิตและวิศวกรรม", patterns: ["ความปลอดภัย", "จป\\.", "อาชีวอนามัย", "สิ่งแวดล้อม", en("Safety"), en("Occupational health"), en("ESG")] },
  { name: "ระบบมาตรฐาน ISO และ GMP", category: "การผลิตและวิศวกรรม", patterns: ["ระบบมาตรฐาน", en("ISO"), en("GMP"), en("HACCP"), en("HALAL"), en("Kaizen"), en("Lean"), en("5ส"), "5ส"] },

  /* — โลจิสติกส์และคลังสินค้า — */
  { name: "คลังสินค้าและสต๊อก", category: "โลจิสติกส์", patterns: ["คลังสินค้า", "สต๊อก", "สต็อก", "จัดเก็บสินค้า", "เช็คของ", en("Warehouse"), en("Inventory"), en("Stock")] },
  { name: "ขนส่งและกระจายสินค้า", category: "โลจิสติกส์", patterns: ["ขนส่ง", "กระจายสินค้า", "จัดส่ง", "เดลิเวอรี่", en("Logistics"), en("Transport"), en("Delivery"), en("Shipping")] },
  { name: "ขับรถและงานภาคสนาม", category: "โลจิสติกส์", patterns: ["ขับรถ", "พนักงานขับ", "ออกตลาด", "ลงพื้นที่", "ภาคสนาม", en("Driver"), en("Driving"), en("Field work")] },

  /* — เกษตรและอาหาร — */
  { name: "การเกษตรและปศุสัตว์", category: "เกษตรและอาหาร", patterns: ["เกษตร", "ปศุสัตว์", "การเลี้ยงสัตว์", "พืชไร่", "อ้อย", "มันสำปะหลัง", "ข้าว", "ฟาร์ม", en("Agriculture"), en("Farm"), en("Livestock")] },
  { name: "อุตสาหกรรมอาหารและแปรรูป", category: "เกษตรและอาหาร", patterns: ["แปรรูป", "อุตสาหกรรมอาหาร", "โรงงานน้ำตาล", "โรงสี", "ผลิตอาหาร", en("Food processing"), en("Food industry")] },
  { name: "วิทยาศาสตร์และห้องปฏิบัติการ", category: "เกษตรและอาหาร", patterns: ["ห้องปฏิบัติการ", "ห้องแล็บ", "วิเคราะห์ตัวอย่าง", en("Laboratory"), en("Lab"), en("Chemist")] },

  /* — บริการ สุขภาพ และการศึกษา — */
  { name: "งานบริการลูกค้าและคอลเซ็นเตอร์", category: "บริการและสุขภาพ", patterns: ["บริการลูกค้า", "คอลเซ็นเตอร์", "รับสาย", "ต้อนรับ", en("Customer Service"), en("Call Center"), en("Reception")] },
  { name: "งานสุขภาพและพยาบาล", category: "บริการและสุขภาพ", patterns: ["พยาบาล", "เภสัช", "ผู้ช่วยแพทย์", "สาธารณสุข", "เทคนิคการแพทย์", en("Nurse"), en("Pharmacist"), en("Medical")] },
  { name: "การสอนและฝึกอบรม", category: "บริการและสุขภาพ", patterns: ["การสอน", "ครู", "อาจารย์", "ติวเตอร์", "แนะแนว", en("Teaching"), en("Teacher"), en("Trainer"), en("Instructor")] },
  { name: "งานอาหารและเครื่องดื่ม", category: "บริการและสุขภาพ", patterns: ["ร้านอาหาร", "ครัว", "บาริสต้า", "เชฟ", "กุ๊ก", en("Restaurant"), en("Barista"), en("Chef"), en("Kitchen")] },
];

/* ---------- ทักษะเชิงพฤติกรรม ใช้ชุดเดียวกันทุกงานเพื่อให้เทียบข้ามสายได้ ---------- */

export const SOFT_SKILLS = [
  { name: "การสื่อสาร", category: "ทักษะเชิงพฤติกรรม", patterns: ["การสื่อสาร", "สื่อสารดี", "มนุษยสัมพันธ์", "พูดจา", en("Communication"), en("Interpersonal")] },
  { name: "การทำงานเป็นทีม", category: "ทักษะเชิงพฤติกรรม", patterns: ["ทำงานเป็นทีม", "ทำงานร่วมกับผู้อื่น", en("Teamwork"), en("Collaboration")] },
  /* "ความรับผิดชอบ" ลอย ๆ จะไปตรงกับหัวข้อ "หน้าที่และความรับผิดชอบ" ของทุกประกาศ
     จึงบังคับให้มีคำขยายที่บ่งชี้ว่าเป็นคุณสมบัติของผู้สมัคร ไม่ใช่ชื่อหัวข้อ */
  { name: "ความรับผิดชอบ", category: "ทักษะเชิงพฤติกรรม", patterns: ["มีความรับผิดชอบ", "ความรับผิดชอบสูง", "รับผิดชอบสูง", "ตรงต่อเวลา", "ซื่อสัตย์", en("Responsible"), en("Accountability")] },
  { name: "การแก้ปัญหา", category: "ทักษะเชิงพฤติกรรม", patterns: ["แก้ปัญหา", "แก้ไขปัญหา", "วิเคราะห์ปัญหา", en("Problem solving"), en("Analytical")] },
  { name: "ความอดทนและแรงกดดัน", category: "ทักษะเชิงพฤติกรรม", patterns: ["อดทน", "ภายใต้แรงกดดัน", "ความกดดัน", en("Work under pressure"), en("Resilience")] },
  { name: "ภาวะผู้นำและการบริหารทีม", category: "ทักษะเชิงพฤติกรรม", patterns: ["ภาวะผู้นำ", "บริหารทีม", "ควบคุมทีม", "หัวหน้างาน", en("Leadership"), en("Supervisory"), en("Management")] },
  { name: "การวางแผนและจัดลำดับงาน", category: "ทักษะเชิงพฤติกรรม", patterns: ["วางแผน", "จัดลำดับความสำคัญ", "บริหารเวลา", en("Planning"), en("Time management"), en("Organizing")] },
  { name: "ใจรักบริการ", category: "ทักษะเชิงพฤติกรรม", patterns: ["ใจรักบริการ", "รักงานบริการ", "จิตบริการ", "Service ?mind", en("Service minded")] },
  { name: "การเรียนรู้และพัฒนาตนเอง", category: "ทักษะเชิงพฤติกรรม", patterns: ["เรียนรู้", "พัฒนาตนเอง", "กระตือรือร้น", en("Eager to learn"), en("Self development"), en("Proactive")] },
  /* "ละเอียด" ลอย ๆ จะไปตรงกับ "รายละเอียดงาน" ซึ่งเป็นหัวข้อ ไม่ใช่ทักษะ */
  { name: "ความละเอียดรอบคอบ", category: "ทักษะเชิงพฤติกรรม", patterns: ["ละเอียดรอบคอบ", "มีความละเอียด", "รอบคอบ", en("Detail oriented"), en("Meticulous")] },
];

/* ---------- คุณสมบัติที่ประกาศงานไทยระบุแยกจากทักษะ ---------- */

export const REQUIREMENT_TAGS = [
  { name: "ใบอนุญาตขับขี่", patterns: ["ใบขับขี่", "ใบอนุญาตขับขี่", en("Driving license"), en("Driver license")] },
  { name: "มีรถยนต์/จักรยานยนต์ส่วนตัว", patterns: ["มีรถยนต์", "รถจักรยานยนต์", "มีรถส่วนตัว", "พาหนะส่วนตัว"] },
  { name: "ภาษาอังกฤษ", patterns: ["ภาษาอังกฤษ", en("English"), en("TOEIC")] },
  { name: "ปริญญาตรีขึ้นไป", patterns: ["ปริญญาตรี", en("Bachelor")] },
  { name: "ปวส./ปวช.", patterns: ["ปวส", "ปวช", "อนุปริญญา", en("Vocational")] },
  { name: "ยินดีรับนักศึกษาจบใหม่", patterns: ["จบใหม่", "ไม่มีประสบการณ์ก็ได้", "ยินดีรับนักศึกษา", en("New graduate"), en("Fresh graduate")] },
  { name: "ต้องมีประสบการณ์", patterns: ["มีประสบการณ์", "ประสบการณ์อย่างน้อย", en("Experience required"), en("years of experience")] },
];

/* ---------- การจับคู่ ---------- */

const compile = list => list.map(skill => ({
  ...skill,
  regex: new RegExp(skill.patterns.join("|"), "iu"),
}));

const TECH = compile(TECHNICAL_SKILLS);
const SOFT = compile(SOFT_SKILLS);
const REQS = compile(REQUIREMENT_TAGS);

/** คืนรายชื่อทักษะที่พบในข้อความเดียว */
export function inferSkillsFromText(text = "") {
  if (!text) return [];
  const found = [];
  for (const skill of [...TECH, ...SOFT]) {
    if (skill.regex.test(text)) found.push({ name: skill.name, category: skill.category });
  }
  return found;
}

/** คืนคุณสมบัติที่ประกาศระบุ เช่น ใบขับขี่ วุฒิ ประสบการณ์ */
export function inferRequirementsFromText(text = "") {
  if (!text) return [];
  return REQS.filter(tag => tag.regex.test(text)).map(tag => tag.name);
}

/** นับความถี่ของทักษะข้ามงานทั้งหมด แล้วคิดเป็นร้อยละของงานที่พบ */
export function buildSkillCounts(jobs, { category = null } = {}) {
  const totals = new Map();
  for (const job of jobs) {
    for (const skill of job.skills || []) {
      if (category && skill.category !== category) continue;
      const current = totals.get(skill.name) || { name: skill.name, category: skill.category, count: 0 };
      current.count += 1;
      totals.set(skill.name, current);
    }
  }
  const denominator = jobs.length || 1;
  return [...totals.values()]
    .map(item => ({ ...item, percent: Math.round((item.count / denominator) * 1000) / 10 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "th"));
}

export const SKILL_CATEGORIES = [...new Set(TECHNICAL_SKILLS.map(s => s.category))];
