import { z } from "zod";
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
