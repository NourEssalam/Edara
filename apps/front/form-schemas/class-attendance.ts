import { date, z } from "zod";
// class-attendance
// classes
// Define acceptable file types
const ACCEPTED_FILE_TYPES = [
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "text/csv", // .csv
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Form schema

// create class
export const classCreationSchema = z.object({
  class_name: z.string().min(4, "اسم القسم مطلوب (على الأقل 4 أحرف)"),

  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "يجب ألا يتجاوز حجم الملف 5 ميغابايت"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "يُسمح فقط بملفات CSV أو Excel"
    ),
});

// update class
export const classUpdateSchema = z.object({
  classId: z.string(),
  class_name: z.string().min(4, "اسم القسم مطلوب (على الأقل 4 أحرف)"),
});

// delete class
export const classDeleteSchema = z.object({
  classId: z.string(),
  class_name: z.string().min(4, "اسم القسم مطلوب (على الأقل 4 أحرف)"),
  confirm_class_name: z.string().min(4, "اسم القسم مطلوب (على الأقل 4 أحرف)"),
});

/// studentCreationSchema;

export const studentCreationSchema = z.object({
  cin: z
    .string()
    .length(8, { message: "رقم التعريف الوطني يجب أن يكون مكون من 8 أرقام" })
    .nonempty({ message: "رقم التعريف الوطني مطلوب" })
    .regex(/^\d+$/, {
      message: "رقم التعريف الوطني يجب أن يحتوي على أرقام فقط",
    }),

  first_name: z
    .string()
    .max(255, { message: "الاسم الشخصي يجب ألا يتجاوز 255 حرفًا" })
    .nonempty({ message: "الاسم الشخصي مطلوب" }),
  last_name: z
    .string()
    .max(255, { message: "الاسم العائلي يجب ألا يتجاوز 255 حرفًا" })
    .nonempty({ message: "الاسم العائلي مطلوب" }),
  class_id: z.string(),
});

export const studentUpdateSchema = z.object({
  studentId: z.string(),
  cin: z
    .string()
    .length(8, { message: "رقم التعريف الوطني يجب أن يكون مكون من 8 أرقام" })
    .nonempty({ message: "رقم التعريف الوطني مطلوب" })
    .regex(/^\d+$/, {
      message: "رقم التعريف الوطني يجب أن يحتوي على أرقام فقط",
    }),
  first_name: z
    .string()
    .max(255, { message: "الاسم الشخصي يجب ألا يتجاوز 255 حرفًا" })
    .nonempty({ message: "الاسم الشخصي مطلوب" }),
  last_name: z
    .string()
    .max(255, { message: "الاسم العائلي يجب ألا يتجاوز 255 حرفًا" })
    .nonempty({ message: "الاسم العائلي مطلوب" }),
});

export const studentDeleteSchema = z.object({
  studentId: z.string(),
  cin: z
    .string()
    .length(8, { message: "رقم التعريف الوطني يجب أن يكون مكون من 8 أرقام" })
    .nonempty({ message: "رقم التعريف الوطني مطلوب" })
    .regex(/^\d+$/, {
      message: "رقم التعريف الوطني يجب أن يحتوي على أرقام فقط",
    }),
  confirm_cin: z
    .string()
    .length(8, { message: "رقم التعريف الوطني يجب أن يكون مكون من 8 أرقام" })
    .nonempty({ message: "رقم التعريف الوطني مطلوب" })
    .regex(/^\d+$/, {
      message: "رقم التعريف الوطني يجب أن يحتوي على أرقام فقط",
    }),
});

// create course
export const courseCreationSchema = z.object({
  course_name: z.string().nonempty({ message: "اسم الدرس مطلوب" }),
  teacher_ids: z
    .array(z.string())
    .min(1, { message: "يجب اختيار أستاذ  واحد على الأقل" }),
});

// Define course update schema
export const courseUpdateSchema = z.object({
  course_id: z.string().min(1, "معرف الدرس مطلوب"),
  course_name: z.string().min(1, "اسم الدرس مطلوب"),
  teacher_ids: z.array(z.string()).min(1, "يجب اختيار معلم واحد على الأقل"),
});

// delete class
export const courseDeleteSchema = z.object({
  courseId: z.string(),
  course_name: z.string().min(4, "اسم القسم مطلوب (على الأقل 4 أحرف)"),
  confirm_course_name: z.string().min(4, "اسم القسم مطلوب (على الأقل 4 أحرف)"),
});

export const classCourseAssign = z.object({
  course_id: z.string().min(1, "معرف الدرس مطلوب"),
  class_id: z.string().min(1, "معرف القسم مطلوب"),
});

export const CourseSessionSchema = z.object({
  class_id: z.string(),
  course_id: z.string(),
  date: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date ? new Date(val) : val,
    z.date({
      required_error: "يرجى اختيار تاريخ وتوقيت الحصة.",
    })
    // .refine(
    // // (date) => {
    // //   const hours = date.getHours();
    // //   return hours >= 8 && hours < 18; // 18 = 6pm
    // // },
    // {
    //   message: "يجب أن يكون توقيت الحصة بين الساعة 8 صباحًا و6 مساءً.",
    // }
    // )
  ),

  topic: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z
      .string()
      .min(10, { message: "يجب أن يحتوي الموضوع على 10 أحرف على الأقل." })
      .max(160, { message: "يجب ألا يزيد الموضوع عن 160 حرفًا." })
      .optional()
  ),
});
