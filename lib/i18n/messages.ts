import { type Locale } from './config'

// Static message imports for better production build compatibility
const enMessages = {
  "common": {
    "generate": "Generate",
    "generating": "Generating...",
    "loading": "Loading...",
    "error": "Error",
    "tryAgain": "Try Again",
    "backToGenerate": "Back to Generate",
    "newConcepts": "Generate New Concepts"
  },
  "home": {
    "title": "The Future of {formulation} is Here",
    "formulation": "Formulation",
    "subtitle": "Instantly generate innovative product concepts with our AI-powered {cosmetics} platform",
    "cosmetics": "cosmetics",
    "generateButton": "GENERATE FORMULA",
    "features": {
      "aiResearch": {
        "title": "AI-Powered Research",
        "description": "Advanced AI algorithms analyze ingredient databases to create optimal formulations"
      },
      "targetedSolutions": {
        "title": "Targeted Solutions",
        "description": "Generate precise product concepts tailored to specific market needs and requirements"
      },
      "innovationReady": {
        "title": "Innovation Ready",
        "description": "Stay ahead with cutting-edge formulations and emerging ingredient technologies"
      }
    }
  },
  "generate": {
    "title": "Describe Your Ideal Product Concept",
    "subtitle": "Provide details about your desired cosmetic product, target audience, key benefits, and any specific requirements to generate AI-powered formulation concepts.",
    "form": {
      "label": "Product Specifications",
      "placeholder": "Example: A lightweight, hydrating daily moisturizer for sensitive skin with SPF 30 and anti-pollution claims. Target demographic: urban millennials aged 25-35. Key requirements: fragrance-free, reef-safe sunscreen, suitable for all skin tones...",
      "helpText": "Be as specific as possible to get the best AI-generated recommendations.",
      "generateButton": "GENERATE CONCEPTS",
      "generating": "Generating Concepts...",
      "validation": {
        "required": "Please describe your product concept"
      }
    },
    "tips": {
      "title": "💡 Pro Tips for Better Results:",
      "items": {
        "0": "Include target demographic and skin type",
        "1": "Specify desired product format (cream, serum, lotion, etc.)",
        "2": "Mention key benefits and claims you want to achieve",
        "3": "Note any ingredients to avoid or include",
        "4": "Describe usage occasion (morning, evening, daily, etc.)"
      }
    }
  },
  "results": {
    "title": "AI-Generated Product Concepts",
    "basedOn": "Based on your specifications:",
    "loading": {
      "title": "Generating AI-Powered Concepts...",
      "subtitle": "Our AI is analyzing your requirements and creating innovative formulations."
    },
    "error": {
      "title": "Error Loading Results",
      "tryAgain": "Try Again"
    },
    "concept": {
      "keyClaims": "Key Claims",
      "keyIngredients": "Key Ingredients"
    },
    "empty": {
      "message": "No product concepts were generated. Please try again with different specifications.",
      "tryAgain": "Try Again"
    }
  },
  "language": {
    "switch": "Language",
    "switchTo": "Switch to {language}"
  }
}

const thMessages = {
  "common": {
    "generate": "สร้าง",
    "generating": "กำลังสร้าง...",
    "loading": "กำลังโหลด...",
    "error": "ข้อผิดพลาด",
    "tryAgain": "ลองอีกครั้ง",
    "backToGenerate": "กลับไปสร้าง",
    "newConcepts": "สร้างแนวคิดใหม่"
  },
  "home": {
    "title": "อนาคตของ{formulation}มาถึงแล้ว",
    "formulation": "การสร้างสูตร",
    "subtitle": "สร้างแนวคิดผลิตภัณฑ์นวัตกรรมได้ทันทีด้วยแพลตฟอร์ม{cosmetics}ที่ขับเคลื่อนด้วย AI",
    "cosmetics": "เครื่องสำอาง",
    "generateButton": "สร้างสูตร",
    "features": {
      "aiResearch": {
        "title": "การวิจัยที่ขับเคลื่อนด้วย AI",
        "description": "อัลกอริทึม AI ขั้นสูงวิเคราะห์ฐานข้อมูลส่วนผสมเพื่อสร้างสูตรที่เหมาะสมที่สุด"
      },
      "targetedSolutions": {
        "title": "โซลูชันเฉพาะเจาะจง",
        "description": "สร้างแนวคิดผลิตภัณฑ์ที่แม่นยำสำหรับความต้องการและข้อกำหนดของตลาดเฉพาะ"
      },
      "innovationReady": {
        "title": "พร้อมสำหรับนวัตกรรม",
        "description": "นำหน้าด้วยสูตรล้ำสมัยและเทคโนโลยีส่วนผสมใหม่ๆ"
      }
    }
  },
  "generate": {
    "title": "อธิบายแนวคิดผลิตภัณฑ์ในอุดมคติของคุณ",
    "subtitle": "ให้รายละเอียดเกี่ยวกับผลิตภัณฑ์เครื่องสำอางที่ต้องการ กลุ่มเป้าหมาย ประโยชน์หลัก และข้อกำหนดเฉพาะใดๆ เพื่อสร้างแนวคิดสูตรที่ขับเคลื่อนด้วย AI",
    "form": {
      "label": "ข้อกำหนดผลิตภัณฑ์",
      "placeholder": "ตัวอย่าง: ครีมบำรุงรายวันที่เบาบาง ให้ความชุ่มชื้น สำหรับผิวแพ้ง่าย พร้อม SPF 30 และคุณสมบัติป้องกันมลพิษ กลุ่มเป้าหมาย: คนรุ่นมิลเลนเนียลในเมืองอายุ 25-35 ปี ข้อกำหนดหลัก: ปราศจากน้ำหอม ครีมกันแดดที่ปลอดภัยต่อแนวปะการัง เหมาะสำหรับทุกโทนผิว...",
      "helpText": "ระบุให้ละเอียดที่สุดเท่าที่เป็นไปได้เพื่อรับคำแนะนำจาก AI ที่ดีที่สุด",
      "generateButton": "สร้างแนวคิด",
      "generating": "กำลังสร้างแนวคิด...",
      "validation": {
        "required": "กรุณาอธิบายแนวคิดผลิตภัณฑ์ของคุณ"
      }
    },
    "tips": {
      "title": "💡 เคล็ดลับสำหรับผลลัพธ์ที่ดีขึ้น:",
      "items": {
        "0": "ระบุกลุ่มเป้าหมายและประเภทผิว",
        "1": "กำหนดรูปแบบผลิตภัณฑ์ที่ต้องการ (ครีม เซรั่ม โลชั่น เป็นต้น)",
        "2": "กล่าวถึงประโยชน์และการอ้างสิทธิ์หลักที่ต้องการบรรลุ",
        "3": "ระบุส่วนผสมที่ควรหลีกเลี่ยงหรือรวมไว้",
        "4": "อธิบายโอกาสในการใช้ (เช้า เย็น ทุกวัน เป็นต้น)"
      }
    }
  },
  "results": {
    "title": "แนวคิดผลิตภัณฑ์ที่สร้างโดย AI",
    "basedOn": "อิงจากข้อกำหนดของคุณ:",
    "loading": {
      "title": "กำลังสร้างแนวคิดที่ขับเคลื่อนด้วย AI...",
      "subtitle": "AI ของเรากำลังวิเคราะห์ความต้องการของคุณและสร้างสูตรนวัตกรรม"
    },
    "error": {
      "title": "ข้อผิดพลาดในการโหลดผลลัพธ์",
      "tryAgain": "ลองอีกครั้ง"
    },
    "concept": {
      "keyClaims": "การอ้างสิทธิ์หลัก",
      "keyIngredients": "ส่วนผสมหลัก"
    },
    "empty": {
      "message": "ไม่มีแนวคิดผลิตภัณฑ์ที่ถูกสร้างขึ้น กรุณาลองใหม่ด้วยข้อกำหนดที่แตกต่างกัน",
      "tryAgain": "ลองอีกครั้ง"
    }
  },
  "language": {
    "switch": "ภาษา",
    "switchTo": "เปลี่ยนเป็น {language}"
  }
}

export const messages = {
  en: enMessages,
  th: thMessages
} as const

export function getMessages(locale: Locale) {
  return messages[locale] || messages.en
}