const JobTitles = {
  // Administrative positions (A_)
  A_CHIEF_ADMINISTRATOR: "متصرف رئيسي",
  A_RECORDS_KEEPER: "حافظ مكتبات",
  A_CHIEF_SHARED_CORPS_TECHNICIAN: "تقني رئيسي سلك مشترك",
  A_CENTRAL_SHARED_CORPS_INSPECTOR: "محلل مركزي سلك مشترك",
  A_ASSISTANT_INSPECTOR_SHARED_CORPS: "متصرف مستشار (سلك مشترك)",
  A_HIGH_EDUCATION_SUPERVISOR: "متصرف للتعليم العالي",
  A_HIGH_EDUCATION_ATTACHÉ: "ملحق للتعليم العالي",
  A_ASSISTANT_CLASS_A_TECHNICAL: "عون وفق صنف ب عون تقني",
  A_HIGH_EDUCATION_SECRETARY: "مسكتب للتعليم العالي",
  A_HIGH_EDUCATION_SECRETARY_CLASS_A: "مسكتب للتعليم العالي عون وفق صنف ج",
  A_ASSISTANT_DOCUMENTATION_ARCHIVES: "متصرف مساعد في الوثائق والأرشيف",
  A_CLERK: "مكتبي",
  A_HIGH_EDUCATION_WRITER: "كاتب للتعليم العالي",
  A_HIGH_EDUCATION_WRITER_CLASS_B: "كاتب للتعليم العالي (عون وفق صنف ب)",

  // Technical positions (T_)
  T_FIRST_TECHNICIAN: "تقني أول",
  T_SHARED_CORPS_TECHNICIAN: "تقني سلك مشترك",
  T_SHARED_CORPS_TECHNICAL_AGENT: "عون تقني سلك مشترك",

  // Research and Application Assistant positions (R_)
  R_SENIOR_CHIEF_APPLICATION_RESEARCH_ASSISTANT:
    "مساعد تطبيق وبحث رئيس فوق الرتبة",
  R_CHIEF_APPLICATION_RESEARCH_ASSISTANT: "مساعد تطبيق وبحث رئيس",
  R_SENIOR_FIRST_APPLICATION_RESEARCH_ASSISTANT:
    "مساعد تطبيق وبحث أول فوق الرتبة",
  R_FIRST_APPLICATION_RESEARCH_ASSISTANT: "مساعد تطبيق وبحث أول",
  R_APPLICATION_RESEARCH_ASSISTANT: "مساعد تطبيق وبحث",

  // Worker positions (W_)
  W_GARAGE_CHIEF: "رئيس مخازة",
  W_PRINTING_WORKSHOP_ASSISTANT_CHIEF: "رئيس مساعد لورشة الطباعة",
  W_SECOND_CLASS_BUILDING_ELECTRICIAN: "كهربائي بناء من الدرجة الثانية",
  W_SECOND_CLASS_PHONE_DISTRIBUTOR: "موزع هاتف من الدرجة الثانية",
  W_THIRD_CLASS_MAIL_DISTRIBUTOR: "موزع بريد من الدرجة الثالثة",
  W_THIRD_CLASS_PRINTING_PRESS_WORKER: "عامل طباعة وسحب من الدرجة الثالثة",
  W_FIRST_CLASS_SPECIALIST_HEATING_COOLING:
    "عامل مختص في آلات التبريد والتسخين من الدرجة الأولى",
  W_SECOND_CLASS_PRINTING_PRESS_WORKER: "عامل طباعة وسحب من الدرجة الثانية",
  W_PRINTING_AND_PRESS_WORKER: "طباعة وسحب",
  W_FIRST_CLASS_MAIL_DISTRIBUTOR: "موزع بريد من الدرجة الأولى",
  W_FIRST_CLASS_PRINTING_PRESS_WORKER: "عامل طباعة وسحب من الدرجة الأولى",
  W_PRINTING_AND_PRESS: "طباعة وسحب",
  W_PRESS_AND_COPY: "سحب ونسخ",
  W_WORKSHOP_WORKER: "عامل بورشة أو بحضيرة",
  W_FOURTH_CLASS_CLEANER: "منظف من الدرجة الرابعة",
  W_MULTI_SKILLED_WORKER: "عامل متعدد الحرف",
  W_CLASS_03_WORKER: "عامل صنف 03",
} as const;

export type JobTitle = keyof typeof JobTitles;
