/* ทะเบียนทักษะสำหรับตลาดแรงงานจังหวัดกาฬสินธุ์
 *
 * ชื่อทักษะเป็นภาษาอังกฤษเพื่อให้เทียบกับกรอบสากลได้ (O*NET, ESCO, Indeed)
 * พร้อมคำแปลไทยกำกับสำหรับผู้อ่านในพื้นที่ ส่วน pattern จับได้ทั้งสองภาษา
 * เพราะประกาศงานไทยเขียนผสมกันเสมอ
 *
 * เกณฑ์แบ่ง Hard/Soft ยึดตาม Indeed:
 *   Hard skill — ความรู้หรือการฝึกอบรมเชิงเทคนิค เรียนผ่านการศึกษาหรือฝึกฝนเฉพาะทาง
 *                ใช้ทำงานเชิงเทคนิคที่ระบุได้ วัดผลได้ และผูกกับสายงาน
 *   Soft skill — นิสัยและลักษณะส่วนบุคคลที่กำหนดวิธีทำงานร่วมกับผู้อื่น
 *                สั่งสมจากประสบการณ์ ใช้ข้ามสายงานและข้ามอุตสาหกรรมได้
 *
 * สิ่งที่ "ไม่ใช่ทักษะ" และต้องไม่อยู่ในทะเบียนนี้ — ชื่ออาชีพ (พยาบาล เชฟ) ชื่ออุตสาหกรรม
 * (ก่อสร้าง เกษตร) และรูปแบบการจ้าง (งานประจำ ทำงานเป็นกะ) สิ่งเหล่านั้นบอกว่า
 * "งานอยู่ในวงการไหน" ไม่ได้บอกว่า "ผู้สมัครต้องทำอะไรเป็น" จึงแยกไปเป็น domain ต่างหาก
 *
 * pattern ใช้ \b เฉพาะกับคำอังกฤษ เพราะภาษาไทยไม่เว้นวรรคระหว่างคำ
 */

const en = word => `\\b${word}\\b`;

/* ---------- HARD SKILLS ---------- */

export const TECHNICAL_SKILLS = [
  /* — Computer & Digital — */
  { name: "Microsoft Office", nameTh: "ไมโครซอฟท์ ออฟฟิศ", category: "Computer & Digital",
    patterns: ["ไมโครซอฟท์ ?ออฟฟิศ", "โปรแกรมสำเร็จรูป", en("MS Office"), en("Microsoft Office"), en("Word"), en("PowerPoint")] },
  { name: "Spreadsheets & Data Entry", nameTh: "สเปรดชีตและการบันทึกข้อมูล", category: "Computer & Digital",
    patterns: ["เอ็กเซล", "ตารางคำนวณ", "คีย์ข้อมูล", "บันทึกข้อมูล", en("Excel"), en("Spreadsheet"), en("VLOOKUP"), en("Pivot"), en("Data entry")] },
  { name: "Computer Literacy", nameTh: "การใช้คอมพิวเตอร์พื้นฐาน", category: "Computer & Digital",
    patterns: ["ใช้คอมพิวเตอร์", "คอมพิวเตอร์เบื้องต้น", "คอมพิวเตอร์ได้ดี", en("Computer literacy"), en("Basic computer")] },
  { name: "ERP & SAP Systems", nameTh: "ระบบ ERP และ SAP", category: "Computer & Digital",
    patterns: ["ระบบ ?ERP", en("ERP"), en("SAP"), en("Oracle"), en("Navision"), en("Dynamics")] },
  { name: "Software Development", nameTh: "การพัฒนาซอฟต์แวร์", category: "Computer & Digital",
    patterns: ["เขียนโปรแกรม", "พัฒนาโปรแกรม", "นักพัฒนา", en("Programming"), en("Developer"), en("Java"), en("Python"), en("PHP"), en("Flutter"), en("React")] },
  { name: "SQL & Database Management", nameTh: "ฐานข้อมูลและ SQL", category: "Computer & Digital",
    patterns: ["ฐานข้อมูล", en("SQL"), en("Database"), en("MySQL")] },
  { name: "IT Support & Networking", nameTh: "ดูแลระบบและเครือข่าย", category: "Computer & Digital",
    patterns: ["ดูแลระบบ", "ซ่อมคอมพิวเตอร์", "ระบบเครือข่าย", en("IT Support"), en("Network"), en("Helpdesk"), en("System Admin")] },
  { name: "Digital Marketing & Social Media", nameTh: "การตลาดดิจิทัลและโซเชียลมีเดีย", category: "Computer & Digital",
    patterns: ["การตลาดออนไลน์", "สื่อออนไลน์", "โซเชียล ?มีเดีย", "ยิงแอด", en("Digital Marketing"), en("Social Media"), en("Facebook"), en("TikTok"), en("SEO")] },
  { name: "Graphic Design & Video Editing", nameTh: "ออกแบบกราฟิกและตัดต่อ", category: "Computer & Digital",
    patterns: ["ออกแบบกราฟิก", "ตัดต่อ", "กราฟฟิก", en("Photoshop"), en("Illustrator"), en("Canva"), en("Premiere"), en("Graphic Design")] },
  { name: "Point-of-Sale Systems", nameTh: "ระบบขายหน้าร้าน", category: "Computer & Digital",
    patterns: ["เครื่องคิดเงิน", "ระบบขายหน้าร้าน", en("POS"), en("Point of Sale"), en("Cashier system")] },

  /* — Engineering & Manufacturing — */
  { name: "PLC & Industrial Automation", nameTh: "PLC และระบบอัตโนมัติ", category: "Engineering & Manufacturing",
    patterns: ["ระบบอัตโนมัติ", "ควบคุมอัตโนมัติ", "ระบบควบคุม", "อินเวอร์เตอร์", "หุ่นยนต์", "เซนเซอร์", "เซ็นเซอร์", en("PLC"), en("SCADA"), en("HMI"), en("DCS"), en("Inverter"), en("Servo"), en("Automation"), en("Robotics"), en("Ladder")] },
  { name: "Electrical Systems", nameTh: "ระบบไฟฟ้าและอิเล็กทรอนิกส์", category: "Engineering & Manufacturing",
    patterns: ["ไฟฟ้า", "อิเล็กทรอนิกส์", "ช่างไฟ", "ระบบไฟ", en("Electrical"), en("Electronic"), en("Wiring")] },
  { name: "Mechanical & Welding", nameTh: "งานเครื่องกลและงานเชื่อม", category: "Engineering & Manufacturing",
    patterns: ["เครื่องกล", "งานเชื่อม", "ช่างกล", "ช่างเชื่อม", "กลึง", en("Mechanical"), en("Welding"), en("CNC"), en("Lathe")] },
  { name: "Equipment Maintenance", nameTh: "ซ่อมบำรุงเครื่องจักร", category: "Engineering & Manufacturing",
    patterns: ["ซ่อมบำรุง", "บำรุงรักษา", "ซ่อมเครื่องจักร", "ช่างซ่อม", en("Maintenance"), en("Repair"), en("Mechanic"), en("Troubleshoot")] },
  { name: "CAD & Technical Drawing", nameTh: "เขียนแบบและ CAD", category: "Engineering & Manufacturing",
    patterns: ["เขียนแบบ", "อ่านแบบ", "ไดอะแกรม", en("AutoCAD"), en("CAD"), en("SolidWorks"), en("Blueprint")] },
  { name: "Production Planning & Control", nameTh: "วางแผนและควบคุมการผลิต", category: "Engineering & Manufacturing",
    patterns: ["ควบคุมการผลิต", "กระบวนการผลิต", "สายการผลิต", "วางแผนการผลิต", en("Production planning"), en("Production control"), en("Manufacturing process")] },
  { name: "Quality Control (QA/QC)", nameTh: "ควบคุมคุณภาพ", category: "Engineering & Manufacturing",
    patterns: ["ควบคุมคุณภาพ", "ตรวจสอบคุณภาพ", "ประกันคุณภาพ", en("QA"), en("QC"), en("Quality Control"), en("Quality Assurance")] },
  { name: "ISO / GMP / HACCP Standards", nameTh: "ระบบมาตรฐานสากล", category: "Engineering & Manufacturing",
    patterns: ["ระบบมาตรฐาน", "5ส", en("ISO"), en("GMP"), en("HACCP"), en("HALAL"), en("Kaizen"), en("Lean"), en("TPM")] },
  { name: "Occupational Health & Safety", nameTh: "ความปลอดภัยและอาชีวอนามัย", category: "Engineering & Manufacturing",
    patterns: ["ความปลอดภัย", "จป\\.", "อาชีวอนามัย", "งานด้านสิ่งแวดล้อม", en("Safety"), en("Occupational health"), en("EHS")] },
  { name: "Surveying & Construction Estimation", nameTh: "สำรวจและถอดแบบก่อสร้าง", category: "Engineering & Manufacturing",
    patterns: ["ถอดแบบ", "ประมาณราคา", "สำรวจหน้างาน", "ควบคุมงานก่อสร้าง", en("Quantity survey"), en("Cost estimation"), en("Site supervision")] },

  /* — Business & Finance — */
  { name: "Accounting & Financial Reporting", nameTh: "บัญชีและงบการเงิน", category: "Business & Finance",
    patterns: ["บัญชี", "งบการเงิน", "งบดุล", "ลงบัญชี", en("Accounting"), en("Bookkeeping"), en("Financial statement")] },
  { name: "Taxation", nameTh: "ภาษีอากร", category: "Business & Finance",
    patterns: ["ภาษี", "ภ\\.ง\\.ด", "ภ\\.พ\\.", "สรรพากร", en("Tax"), en("VAT"), en("Withholding")] },
  { name: "Credit & Lending", nameTh: "สินเชื่อและการเงิน", category: "Business & Finance",
    patterns: ["สินเชื่อ", "เร่งรัดหนี้", "บัตรเครดิต", "ประกันภัย", "วิเคราะห์เครดิต", en("Credit"), en("Loan"), en("Insurance"), en("Underwriting")] },
  { name: "Procurement & Purchasing", nameTh: "จัดซื้อจัดหา", category: "Business & Finance",
    patterns: ["จัดซื้อ", "จัดหาผู้ขาย", "ซัพพลายเออร์", en("Purchasing"), en("Procurement"), en("Sourcing"), en("Vendor")] },
  { name: "Document & Records Management", nameTh: "งานเอกสารและธุรการ", category: "Business & Finance",
    patterns: ["ธุรการ", "งานเอกสาร", "จัดเก็บเอกสาร", "จัดทำเอกสาร", en("Admin"), en("Administrative"), en("Documentation"), en("Filing")] },
  { name: "HR & Payroll Administration", nameTh: "งานบุคคลและเงินเดือน", category: "Business & Finance",
    patterns: ["ทรัพยากรบุคคล", "งานบุคคล", "ฝ่ายบุคคล", "สรรหาบุคลากร", "สรรหาว่าจ้าง", "จัดฝึกอบรม", "งานเงินเดือน", en("HR"), en("Human Resource"), en("Recruitment"), en("Payroll")] },

  /* — Sales & Marketing — */
  { name: "Sales & Business Development", nameTh: "งานขายและขยายตลาด", category: "Sales & Marketing",
    patterns: ["งานขาย", "พนักงานขาย", "ปิดการขาย", "เสนอขาย", "ยอดขาย", "หาลูกค้า", "ขยายตลาด", en("Sales"), en("Selling"), en("Business Development")] },
  { name: "Account & Client Management", nameTh: "ดูแลลูกค้ารายสำคัญ", category: "Sales & Marketing",
    patterns: ["ดูแลลูกค้า", "รักษาฐานลูกค้า", "ความสัมพันธ์ลูกค้า", en("Customer Relationship"), en("CRM"), en("Account Management")] },
  { name: "Marketing Strategy & Promotion", nameTh: "วางแผนการตลาดและส่งเสริมการขาย", category: "Sales & Marketing",
    patterns: ["วางแผนการตลาด", "กลยุทธ์การตลาด", "ส่งเสริมการขาย", "จัดโปรโมชั่น", en("Marketing plan"), en("Marketing strategy"), en("Promotion"), en("Merchandising")] },
  { name: "Market Research & Analysis", nameTh: "วิจัยและวิเคราะห์ตลาด", category: "Sales & Marketing",
    patterns: ["สำรวจตลาด", "วิเคราะห์ตลาด", "วิเคราะห์คู่แข่ง", en("Market research"), en("Market analysis"), en("Competitor analysis")] },

  /* — Supply Chain & Logistics — */
  { name: "Inventory & Warehouse Management", nameTh: "คลังสินค้าและสต๊อก", category: "Supply Chain & Logistics",
    patterns: ["คลังสินค้า", "สต๊อก", "สต็อก", "จัดเก็บสินค้า", "เช็คสต", en("Warehouse"), en("Inventory"), en("Stock")] },
  { name: "Logistics & Distribution", nameTh: "ขนส่งและกระจายสินค้า", category: "Supply Chain & Logistics",
    patterns: ["ขนส่ง", "กระจายสินค้า", "จัดส่งสินค้า", "เดลิเวอรี่", en("Logistics"), en("Transport"), en("Distribution"), en("Shipping")] },
  /* อย่าใส่ "ขับขี่" หรือ Driving ลอย ๆ เพราะไปตรงกับ "ใบขับขี่" ซึ่งเป็นเงื่อนไขคัดกรอง
     ไม่ใช่หน้าที่ของตำแหน่ง และซ้ำกับ REQUIREMENT_TAGS อยู่แล้ว */
  { name: "Driving & Vehicle Operation", nameTh: "การขับขี่ยานพาหนะ", category: "Supply Chain & Logistics",
    patterns: ["ขับรถ", "พนักงานขับ", en("Driver"), en("Forklift")] },

  /* — Applied Sciences & Domain Practice — */
  { name: "Agricultural & Livestock Practice", nameTh: "วิชาชีพเกษตรและปศุสัตว์", category: "Applied Sciences",
    patterns: ["ส่งเสริมการเกษตร", "ปศุสัตว์", "การเลี้ยงสัตว์", "พืชไร่", "อ้อย", "มันสำปะหลัง", "เกษตรกร", en("Agronomy"), en("Livestock"), en("Farm management")] },
  { name: "Food Processing Technology", nameTh: "เทคโนโลยีแปรรูปอาหาร", category: "Applied Sciences",
    patterns: ["แปรรูปอาหาร", "อุตสาหกรรมอาหาร", "ผลิตอาหาร", "โรงงานน้ำตาล", "โรงสี", en("Food processing"), en("Food technology")] },
  { name: "Laboratory & Testing", nameTh: "ปฏิบัติการห้องแล็บ", category: "Applied Sciences",
    patterns: ["ห้องปฏิบัติการ", "ห้องแล็บ", "วิเคราะห์ตัวอย่าง", "ทดสอบตัวอย่าง", en("Laboratory"), en("Lab testing"), en("Chemist")] },
  { name: "Clinical & Nursing Practice", nameTh: "การพยาบาลและเวชปฏิบัติ", category: "Applied Sciences",
    patterns: ["พยาบาล", "เภสัช", "ผู้ช่วยแพทย์", "เทคนิคการแพทย์", "เวชระเบียน", en("Nursing"), en("Pharmacist"), en("Clinical")] },
  { name: "Food & Beverage Preparation", nameTh: "การประกอบอาหารและเครื่องดื่ม", category: "Applied Sciences",
    patterns: ["ประกอบอาหาร", "ทำอาหาร", "บาริสต้า", "ชงเครื่องดื่ม", "เชฟ", "กุ๊ก", en("Barista"), en("Chef"), en("Culinary")] },
  { name: "Teaching & Training Delivery", nameTh: "การสอนและฝึกอบรม", category: "Applied Sciences",
    patterns: ["การสอน", "ติวเตอร์", "แนะแนว", "ถ่ายทอดความรู้", en("Teaching"), en("Trainer"), en("Instructor"), en("Curriculum")] },
];

/* ---------- SOFT SKILLS ----------
   นิสัยและลักษณะส่วนบุคคลที่ใช้ข้ามสายงานได้ ไม่ผูกกับอุตสาหกรรมใดอุตสาหกรรมหนึ่ง
   ใช้ชุดเดียวกันกับทุกงานเพื่อให้เทียบข้ามอาชีพได้ */

export const SOFT_SKILLS = [
  { name: "Communication", nameTh: "การสื่อสาร", category: "Soft Skills",
    patterns: ["การสื่อสาร", "สื่อสารดี", "มนุษยสัมพันธ์", "พูดจา", en("Communication"), en("Interpersonal")] },
  { name: "Teamwork", nameTh: "การทำงานเป็นทีม", category: "Soft Skills",
    patterns: ["ทำงานเป็นทีม", "ทำงานร่วมกับผู้อื่น", en("Teamwork"), en("Collaboration")] },
  { name: "Cross-functional Coordination", nameTh: "การประสานงานข้ามหน่วยงาน", category: "Soft Skills",
    patterns: ["ประสานงาน", "ติดต่อประสาน", en("Coordination"), en("Coordinate"), en("Liaise")] },
  { name: "Negotiation & Persuasion", nameTh: "การเจรจาต่อรองและโน้มน้าว", category: "Soft Skills",
    patterns: ["เจรจาต่อรอง", "ต่อรอง", "โน้มน้าว", en("Negotiation"), en("Persuasion")] },
  { name: "Presentation & Public Speaking", nameTh: "การนำเสนอและพูดต่อหน้าชุมชน", category: "Soft Skills",
    patterns: ["นำเสนอ", "พรีเซนต์", "บรรยาย", en("Presentation"), en("Public speaking")] },
  { name: "Dependability & Integrity", nameTh: "ความรับผิดชอบและความซื่อสัตย์", category: "Soft Skills",
    patterns: ["มีความรับผิดชอบ", "ความรับผิดชอบสูง", "รับผิดชอบสูง", "ตรงต่อเวลา", "ซื่อสัตย์", en("Responsible"), en("Dependable"), en("Integrity")] },
  { name: "Problem Solving", nameTh: "การแก้ปัญหา", category: "Soft Skills",
    patterns: ["แก้ปัญหา", "แก้ไขปัญหา", "วิเคราะห์ปัญหา", en("Problem solving"), en("Analytical")] },
  { name: "Resilience Under Pressure", nameTh: "ความอดทนต่อแรงกดดัน", category: "Soft Skills",
    patterns: ["อดทน", "ภายใต้แรงกดดัน", "ความกดดัน", en("Work under pressure"), en("Resilience")] },
  { name: "Leadership & People Management", nameTh: "ภาวะผู้นำและการบริหารทีม", category: "Soft Skills",
    patterns: ["ภาวะผู้นำ", "บริหารทีม", "ควบคุมทีม", "หัวหน้างาน", en("Leadership"), en("Supervisory"), en("People management")] },
  { name: "Planning & Time Management", nameTh: "การวางแผนและบริหารเวลา", category: "Soft Skills",
    patterns: ["วางแผนงาน", "จัดลำดับความสำคัญ", "บริหารเวลา", en("Planning"), en("Time management"), en("Organizing")] },
  { name: "Customer Service Orientation", nameTh: "ใจรักบริการ", category: "Soft Skills",
    patterns: ["ใจรักบริการ", "รักงานบริการ", "จิตบริการ", "บริการลูกค้า", "Service ?mind", en("Customer service"), en("Service minded")] },
  { name: "Adaptability & Willingness to Learn", nameTh: "การปรับตัวและใฝ่เรียนรู้", category: "Soft Skills",
    patterns: ["เรียนรู้", "พัฒนาตนเอง", "กระตือรือร้น", "ปรับตัว", en("Eager to learn"), en("Adaptability"), en("Proactive")] },
  { name: "Attention to Detail", nameTh: "ความละเอียดรอบคอบ", category: "Soft Skills",
    patterns: ["ละเอียดรอบคอบ", "มีความละเอียด", "รอบคอบ", en("Detail oriented"), en("Meticulous")] },
];

/* ---------- คุณสมบัติที่ประกาศระบุ ----------
   ไม่ใช่ทักษะ แต่เป็นเงื่อนไขคัดกรอง จึงแยกออกมาไม่ปนกับสถิติทักษะ */

export const REQUIREMENT_TAGS = [
  { name: "Driving licence", nameTh: "ใบอนุญาตขับขี่", patterns: ["ใบขับขี่", "ใบอนุญาตขับขี่", en("Driving licence"), en("Driving license")] },
  { name: "Own vehicle", nameTh: "มีพาหนะส่วนตัว", patterns: ["มีรถยนต์", "รถจักรยานยนต์", "มีรถส่วนตัว", "พาหนะส่วนตัว"] },
  { name: "English proficiency", nameTh: "ความสามารถภาษาอังกฤษ", patterns: ["ภาษาอังกฤษ", en("English"), en("TOEIC")] },
  { name: "Bachelor's degree or higher", nameTh: "ปริญญาตรีขึ้นไป", patterns: ["ปริญญาตรี", en("Bachelor")] },
  { name: "Vocational certificate", nameTh: "ปวส./ปวช.", patterns: ["ปวส", "ปวช", "อนุปริญญา", en("Vocational")] },
  { name: "New graduates welcome", nameTh: "ยินดีรับนักศึกษาจบใหม่", patterns: ["จบใหม่", "ไม่มีประสบการณ์ก็ได้", "ยินดีรับนักศึกษา", en("New graduate"), en("Fresh graduate")] },
  { name: "Prior experience required", nameTh: "ต้องมีประสบการณ์", patterns: ["มีประสบการณ์", "ประสบการณ์อย่างน้อย", en("Experience required"), en("years of experience")] },
];

/* ---------- การจับคู่ ---------- */

const compile = list => list.map(skill => ({
  ...skill,
  regex: new RegExp(skill.patterns.join("|"), "iu"),
}));

const TECH = compile(TECHNICAL_SKILLS);
const SOFT = compile(SOFT_SKILLS);
const REQS = compile(REQUIREMENT_TAGS);

export const SOFT_CATEGORY = "Soft Skills";

/** คืนรายชื่อทักษะที่พบในข้อความเดียว */
export function inferSkillsFromText(text = "") {
  if (!text) return [];
  return [...TECH, ...SOFT]
    .filter(skill => skill.regex.test(text))
    .map(({ name, nameTh, category }) => ({ name, nameTh, category }));
}

/** คืนคุณสมบัติที่ประกาศระบุ เช่น ใบขับขี่ วุฒิ ประสบการณ์ */
export function inferRequirementsFromText(text = "") {
  if (!text) return [];
  return REQS.filter(tag => tag.regex.test(text)).map(({ name, nameTh }) => ({ name, nameTh }));
}

/** นับความถี่ของทักษะข้ามงานทั้งหมด แล้วคิดเป็นร้อยละของงานที่พบ */
export function buildSkillCounts(jobs, { category = null } = {}) {
  const totals = new Map();
  for (const job of jobs) {
    for (const skill of job.skills || []) {
      if (category && skill.category !== category) continue;
      const current = totals.get(skill.name)
        || { name: skill.name, nameTh: skill.nameTh, category: skill.category, count: 0 };
      current.count += 1;
      totals.set(skill.name, current);
    }
  }
  const denominator = jobs.length || 1;
  return [...totals.values()]
    .map(item => ({ ...item, percent: Math.round((item.count / denominator) * 1000) / 10 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export const SKILL_CATEGORIES = [...new Set(TECHNICAL_SKILLS.map(s => s.category))];
