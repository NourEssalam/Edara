import { ClassData } from "@/app/(dashboard)/(class-attendance)/classes/classes-list/columns";
import { UserData } from "@/app/(dashboard)/users-management/users-list/columns";
import { UserRole, UserStatus } from "@repo/shared-types";

// Role translations
export const roleTranslations: Record<UserRole, string> = {
  SUPER_ADMIN: "مشرف عام",
  LEAVE_ADMIN: "مسؤول الإجازات",
  WORK_CERTIFICATION_ADMIN: "مسؤول شهادات العمل",
  CLASS_ATTENDANCE_ADMIN: "مسؤول حضور الطلاب في الفصل",
  TEACHER: "أستاذ", // I'm assuming this is the Arabic translation
  GENERAL_STAFF: "موظف",
  // Add any other roles from your enum that might not be in the form
};

// Status translations
export const statusTranslations: Record<UserStatus, string> = {
  ACTIVE: "نشط",
  INACTIVE: "غير نشط",
  SUSPENDED: "معلق",
};

export const userDataFieldTranslations: Record<keyof UserData, string> = {
  id: "المعرّف",
  email: "البريد الإلكتروني",
  full_name: "الاسم الكامل",
  role: "الدور",
  status: "الحالة",
  last_login: "آخر تسجيل دخول",
  created_at: "تاريخ الإنشاء",
  updated_at: "تاريخ التحديث",
  // profile_picture_url: "رابط صورة الملف الشخصي", // if you choose to include it later
};

// Function to translate any value with a provided translation map
export function translate<T extends string | number | symbol>(
  value: T,
  translationMap: Record<T, string>
): string {
  return value ? translationMap[value] || String(value) : "";
}

// Helper functions for common translations
export function translateRole(role: UserRole): string {
  return translate(role, roleTranslations);
}

export function translateStatus(status: UserStatus): string {
  return translate(status, statusTranslations);
}

export function translateUserData(columnId: keyof UserData): string {
  return translate(columnId, userDataFieldTranslations);
}
