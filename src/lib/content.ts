export function waLink(message: string) {
  const number = doctorContent.whatsappNumber;
  if (!number) return "https://wa.me/";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const doctorContent = {
  name: "Dr. Shafqat Batool",
  specialty: "Consultant Gynecologist, Obstetrician & Infertility Specialist",
  promise:
    "Personal, respectful care for every stage of women's health with clear guidance and time to answer your questions.",
  location: "Dera Ghazi Khan",
  hours: "Monday–Saturday · 5:00 PM–9:00 PM",
  experience: "12+ years",
  whatsappNumber: "+15551650974",
  phone: "+1 555 165-0974",
  phoneHref: "+15551650974",
  portrait: "/doctor.png",
  pmcNumber: null,
  trust: {
    qualifications: {
      label: "Qualifications",
      value: "MBBS · FCPS",
      detail: "Gynecology & Obstetrics",
    },
    experience: {
      label: "Experience",
      value: "12+ years",
      detail: "Women's health care",
    },
    languages: {
      label: "Languages",
      value: "Urdu · English",
      detail: "Saraiki · Punjabi",
    },
    clinic: {
      label: "Clinic",
      value: "Dera Ghazi Khan",
      detail: "Medical & Surgical Complex",
    },
  },
  about: {
    heading: "Care shaped around your questions",
    body: "Dr. Shafqat Batool provides attentive care in obstetrics, gynecology, and infertility. Each consultation begins by listening so patients leave with a clear understanding of their concerns and the next practical step.",
    approach:
      "Respectful, private consultations for every stage of a woman's health.",
  },
  services: {
    heading: "Care for women's health",
    intro:
      "Consultation and treatment for the concerns that bring women and families to the clinic.",
    items: [
      {
        title: "Obstetrics & maternity",
        description:
          "Prenatal care, pregnancy follow-up, and delivery planning.",
      },
      {
        title: "Fertility & hormones",
        description:
          "Evaluation and guidance for fertility and hormonal concerns.",
      },
      {
        title: "Gynecology",
        description:
          "Assessment and treatment for common gynecological conditions.",
      },
      {
        title: "Menstrual concerns",
        description: "Care for irregular periods, pain, and cycle changes.",
      },
      {
        title: "Family planning",
        description: "Private guidance on suitable contraception options.",
      },
      {
        title: "Diagnostic care",
        description:
          "Thoughtful investigation and explanation of test results.",
      },
    ],
  },
  clinic: {
    heading: "Visit the clinic",
    name: "Medical & Surgical Complex",
    location: "Dera Ghazi Khan",
    address: "Dera Ghazi Khan, Punjab, Pakistan",
    mapQuery: "Medical & Surgical Complex, Dera Ghazi Khan, Punjab, Pakistan",
    hours: "Monday–Saturday",
    timing: "5:00 PM–9:00 PM",
    appointment: "Appointments by phone or WhatsApp",
    fee: 1500,
  },
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "What should I bring on my first visit?",
        answer: "Bring previous medical or laboratory reports, a current medication list, menstrual history notes, and CNIC or another ID.",
      },
      {
        question: "Is the consultation private?",
        answer: "Consultations are intended to be respectful and private.",
      },
      {
        question: "How do I book an appointment?", 
        answer: "Use the WhatsApp button and send your detais. Your appointment will be booked within a minute.",
      },
      {
        question: "What are the clinic timings?",
        answer: "The clinic is open Monday through Saturday from 5:00 PM to 9:00 PM. Sunday: closed.",
      },
      // {
      //   question: "Is online consultation available?",
      //   answer: "",
      // },
    ],
  },
  testimonials: {
    heading: "Patient experiences",
    reviews: [] as Array<{
      quote: string;
      firstName: string;
      area: string;
      sourceUrl?: string;
      rating?: number;
    }>,
  },
} as const;
