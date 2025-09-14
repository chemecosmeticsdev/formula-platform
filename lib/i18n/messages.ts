import { type Locale } from './config'

// Static message imports for better production build compatibility
// Using flat structure with dot notation keys for IntlProvider compatibility
const enMessages = {
  "common.generate": "Generate",
  "common.generating": "Generating...",
  "common.loading": "Loading...",
  "common.error": "Error",
  "common.tryAgain": "Try Again",
  "common.backToGenerate": "Back to Generate",
  "common.newConcepts": "Generate New Concepts",

  "home.title": "The Future of {formulation} is Here",
  "home.formulation": "Formulation",
  "home.subtitle": "Instantly generate innovative product concepts with our AI-powered {cosmetics} platform",
  "home.cosmetics": "cosmetics",
  "home.generateButton": "GENERATE FORMULA",
  "home.features.aiResearch.title": "AI-Powered Research",
  "home.features.aiResearch.description": "Advanced AI algorithms analyze ingredient databases to create optimal formulations",
  "home.features.targetedSolutions.title": "Targeted Solutions",
  "home.features.targetedSolutions.description": "Generate precise product concepts tailored to specific market needs and requirements",
  "home.features.innovationReady.title": "Innovation Ready",
  "home.features.innovationReady.description": "Stay ahead with cutting-edge formulations and emerging ingredient technologies",

  "generate.title": "Describe Your Ideal Product Concept",
  "generate.subtitle": "Provide details about your desired cosmetic product, target audience, key benefits, and any specific requirements to generate AI-powered formulation concepts.",
  "generate.form.label": "Product Specifications",
  "generate.form.placeholder": "Example: A lightweight, hydrating daily moisturizer for sensitive skin with SPF 30 and anti-pollution claims. Target demographic: urban millennials aged 25-35. Key requirements: fragrance-free, reef-safe sunscreen, suitable for all skin tones...",
  "generate.form.helpText": "Be as specific as possible to get the best AI-generated recommendations.",
  "generate.form.generateButton": "GENERATE CONCEPTS",
  "generate.form.generating": "Generating Concepts...",
  "generate.form.validation.required": "Please describe your product concept",
  "generate.tips.title": "💡 Pro Tips for Better Results:",
  "generate.tips.items.0": "Include target demographic and skin type",
  "generate.tips.items.1": "Specify desired product format (cream, serum, lotion, etc.)",
  "generate.tips.items.2": "Mention key benefits and claims you want to achieve",
  "generate.tips.items.3": "Note any ingredients to avoid or include",
  "generate.tips.items.4": "Describe usage occasion (morning, evening, daily, etc.)",

  "results.title": "AI-Generated Product Concepts",
  "results.basedOn": "Based on your specifications:",
  "results.loading.title": "Generating AI-Powered Concepts...",
  "results.loading.subtitle": "Our AI is analyzing your requirements and creating innovative formulations.",
  "results.error.title": "Error Loading Results",
  "results.error.tryAgain": "Try Again",
  "results.concept.keyClaims": "Key Claims",
  "results.concept.keyIngredients": "Key Ingredients",
  "results.empty.message": "No product concepts were generated. Please try again with different specifications.",
  "results.empty.tryAgain": "Try Again",

  "language.switch": "Language",
  "language.switchTo": "Switch to {language}"
}

const thMessages = {
  "common.generate": "สร้าง",
  "common.generating": "กำลังสร้าง...",
  "common.loading": "กำลังโหลด...",
  "common.error": "ข้อผิดพลาด",
  "common.tryAgain": "ลองอีกครั้ง",
  "common.backToGenerate": "กลับไปสร้าง",
  "common.newConcepts": "สร้างแนวคิดใหม่",

  "home.title": "อนาคตของ{formulation}มาถึงแล้ว",
  "home.formulation": "การสร้างสูตร",
  "home.subtitle": "สร้างแนวคิดผลิตภัณฑ์นวัตกรรมได้ทันทีด้วยแพลตฟอร์ม{cosmetics}ที่ขับเคลื่อนด้วย AI",
  "home.cosmetics": "เครื่องสำอาง",
  "home.generateButton": "สร้างสูตร",
  "home.features.aiResearch.title": "การวิจัยที่ขับเคลื่อนด้วย AI",
  "home.features.aiResearch.description": "อัลกอริทึม AI ขั้นสูงวิเคราะห์ฐานข้อมูลส่วนผสมเพื่อสร้างสูตรที่เหมาะสมที่สุด",
  "home.features.targetedSolutions.title": "โซลูชันเฉพาะเจาะจง",
  "home.features.targetedSolutions.description": "สร้างแนวคิดผลิตภัณฑ์ที่แม่นยำสำหรับความต้องการและข้อกำหนดของตลาดเฉพาะ",
  "home.features.innovationReady.title": "พร้อมสำหรับนวัตกรรม",
  "home.features.innovationReady.description": "นำหน้าด้วยสูตรล้ำสมัยและเทคโนโลยีส่วนผสมใหม่ๆ",

  "generate.title": "อธิบายแนวคิดผลิตภัณฑ์ในอุดมคติของคุณ",
  "generate.subtitle": "ให้รายละเอียดเกี่ยวกับผลิตภัณฑ์เครื่องสำอางที่ต้องการ กลุ่มเป้าหมาย ประโยชน์หลัก และข้อกำหนดเฉพาะใดๆ เพื่อสร้างแนวคิดสูตรที่ขับเคลื่อนด้วย AI",
  "generate.form.label": "ข้อกำหนดผลิตภัณฑ์",
  "generate.form.placeholder": "ตัวอย่าง: ครีมบำรุงรายวันที่เบาบาง ให้ความชุ่มชื้น สำหรับผิวแพ้ง่าย พร้อม SPF 30 และคุณสมบัติป้องกันมลพิษ กลุ่มเป้าหมาย: คนรุ่นมิลเลนเนียลในเมืองอายุ 25-35 ปี ข้อกำหนดหลัก: ปราศจากน้ำหอม ครีมกันแดดที่ปลอดภัยต่อแนวปะการัง เหมาะสำหรับทุกโทนผิว...",
  "generate.form.helpText": "ระบุให้ละเอียดที่สุดเท่าที่เป็นไปได้เพื่อรับคำแนะนำจาก AI ที่ดีที่สุด",
  "generate.form.generateButton": "สร้างแนวคิด",
  "generate.form.generating": "กำลังสร้างแนวคิด...",
  "generate.form.validation.required": "กรุณาอธิบายแนวคิดผลิตภัณฑ์ของคุณ",
  "generate.tips.title": "💡 เคล็ดลับสำหรับผลลัพธ์ที่ดีขึ้น:",
  "generate.tips.items.0": "ระบุกลุ่มเป้าหมายและประเภทผิว",
  "generate.tips.items.1": "กำหนดรูปแบบผลิตภัณฑ์ที่ต้องการ (ครีม เซรั่ม โลชั่น เป็นต้น)",
  "generate.tips.items.2": "กล่าวถึงประโยชน์และการอ้างสิทธิ์หลักที่ต้องการบรรลุ",
  "generate.tips.items.3": "ระบุส่วนผสมที่ควรหลีกเลี่ยงหรือรวมไว้",
  "generate.tips.items.4": "อธิบายโอกาสในการใช้ (เช้า เย็น ทุกวัน เป็นต้น)",

  "results.title": "แนวคิดผลิตภัณฑ์ที่สร้างโดย AI",
  "results.basedOn": "อิงจากข้อกำหนดของคุณ:",
  "results.loading.title": "กำลังสร้างแนวคิดที่ขับเคลื่อนด้วย AI...",
  "results.loading.subtitle": "AI ของเรากำลังวิเคราะห์ความต้องการของคุณและสร้างสูตรนวัตกรรม",
  "results.error.title": "ข้อผิดพลาดในการโหลดผลลัพธ์",
  "results.error.tryAgain": "ลองอีกครั้ง",
  "results.concept.keyClaims": "การอ้างสิทธิ์หลัก",
  "results.concept.keyIngredients": "ส่วนผสมหลัก",
  "results.empty.message": "ไม่มีแนวคิดผลิตภัณฑ์ที่ถูกสร้างขึ้น กรุณาลองใหม่ด้วยข้อกำหนดที่แตกต่างกัน",
  "results.empty.tryAgain": "ลองอีกครั้ง",

  "language.switch": "ภาษา",
  "language.switchTo": "เปลี่ยนเป็น {language}"
}

export const messages = {
  en: enMessages,
  th: thMessages
} as const

export function getMessages(locale: Locale) {
  return messages[locale] || messages.en
}