import { UserRole, UserStatus } from "@repo/shared-types";
import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z
    .string()
    .min(5, "يجب أن يكون اسم المستخدم 5 أحرف على الأقل")
    .regex(
      /^[a-zA-Z0-9 \u0600-\u06FF\u0750-\u077F]+$/,
      "يجب أن يحتوي اسم المستخدم على حروف وأرقام فقط"
    ),
  email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
    .regex(
      /[^a-zA-Z0-9]/,
      "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل"
    ),
  confirmPassword: z
    .string()
    .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
    .regex(
      /[^a-zA-Z0-9]/,
      "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل"
    ),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "دور المستخدم غير صالح" }),
  }),
  status: z
    .nativeEnum(UserStatus, {
      errorMap: () => ({ message: "حالة المستخدم غير صالحة" }),
    })
    .optional(),
  profile_picture_url: z.string().optional(),
  matricule: z
    .string()
    .length(10, "المعرف يجب أن يحتوي على 10 أحرف بالضبط")
    .regex(/^[a-zA-Z0-9]+$/, "المعرف يجب أن يحتوي على أرقام أو أحرف فقط"),

  cin: z
    .string()
    .length(8, "رقم بطاقة التعريف يجب أن يحتوي على 8 أرقام بالضبط")
    .regex(/^[0-9]+$/, "رقم بطاقة التعريف يجب أن يحتوي على أرقام فقط"),
});

export const updateUserSchemaByAdmin = z.object({
  userId: z.string(),
  full_name: z
    .string()
    .min(5, "يجب أن يكون اسم المستخدم 5 أحرف على الأقل")
    .regex(
      /^[a-zA-Z0-9 \u0600-\u06FF\u0750-\u077F]+$/,
      "يجب أن يحتوي اسم المستخدم على حروف وأرقام فقط"
    ),
  email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "دور المستخدم غير صالح" }),
  }),
  status: z
    .nativeEnum(UserStatus, {
      errorMap: () => ({ message: "حالة المستخدم غير صالحة" }),
    })
    .optional(),
  matricule: z
    .string()
    .length(10, "المعرف يجب أن يحتوي على 10 أحرف بالضبط")
    .regex(/^[a-zA-Z0-9]+$/, "المعرف يجب أن يحتوي على أرقام أو أحرف فقط"),

  cin: z
    .string()
    .length(8, "رقم بطاقة التعريف يجب أن يحتوي على 8 أرقام بالضبط")
    .regex(/^[0-9]+$/, "رقم بطاقة التعريف يجب أن يحتوي على أرقام فقط"),
  profile_picture_url: z.string().optional(),
});

export const DeleteUserFormSchema = z.object({
  userId: z.string(),
  full_name: z
    .string()
    .min(5, "يجب أن يكون اسم المستخدم 5 أحرف على الأقل")
    .regex(
      /^[a-zA-Z0-9 \u0600-\u06FF\u0750-\u077F]+$/,
      "يجب أن يحتوي اسم المستخدم على حروف وأرقام فقط"
    ),
  confirm_full_name: z
    .string()
    .min(5, "يجب أن يكون اسم المستخدم 5 أحرف على الأقل")
    .regex(
      /^[a-zA-Z0-9 \u0600-\u06FF\u0750-\u077F]+$/,
      "يجب أن يحتوي اسم المستخدم على حروف وأرقام فقط"
    ),
});

export const UserInfoEssentials = z.object({
  userId: z.string(),
  full_name: z
    .string()
    .min(5, "يجب أن يكون اسم المستخدم 5 أحرف على الأقل")
    .regex(
      /^[a-zA-Z0-9 \u0600-\u06FF\u0750-\u077F]+$/,
      "يجب أن يحتوي اسم المستخدم على حروف وأرقام فقط"
    ),
  email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
  profile_picture_url: z.string().optional(),
});

export const ChangePasswordSchema = z.object({
  userId: z.string(),
  oldPassword: z
    .string()
    .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
    .regex(
      /[^a-zA-Z0-9]/,
      "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل"
    ),
  newPassword: z
    .string()
    .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
    .regex(
      /[^a-zA-Z0-9]/,
      "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل"
    ),
  confirmNewPassword: z
    .string()
    .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
    .regex(
      /[^a-zA-Z0-9]/,
      "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل"
    ),
});
