import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { LeaveType } from "@repo/shared-types";
import { parseLocalDate, parseToLocalMidnight } from "@/lib/formatDates";

const currentYear = new Date().getFullYear();
const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize today's date (remove time)
const phoneSchema = z.string().refine(
  (val) => {
    const phone = parsePhoneNumberFromString(val, "TN"); // Assume Tunisia if no +216
    return phone?.isValid();
  },
  {
    message: "رقم الهاتف غير صالح",
  }
);

const baseLeaveRequestSchema = z.object({
  userId: z.string(),
  leaveType: z.enum([...(Object.values(LeaveType) as [string, ...string[]])], {
    required_error: "نوع الإجازة مطلوب",
  }),

  matricule: z
    .string({
      required_error: "المعرّف الوحيد مطلوب",
    })
    .regex(/^\d{10}$/, "المعرّف الوحيد يجب أن يحتوي على 10 أرقام"),

  name: z.string({
    required_error: "الاسم مطلوب",
  }),

  grade: z.string({
    required_error: "الرتبة مطلوبة",
  }),

  jobPlan: z.string().optional(),

  benefitText: z.string({
    required_error: "نص المصلحة مطلوب",
  }),

  durationFrom: z.preprocess(
    parseToLocalMidnight,
    z.date({ required_error: "تاريخ بداية الإجازة مطلوب" })
  ),
  durationTo: z.preprocess(
    parseToLocalMidnight,
    z.date({ required_error: "تاريخ نهاية الإجازة مطلوب" })
  ),

  leaveYear: z.preprocess(
    (val) => Number(val),
    z
      .number({ required_error: "سنة الإجازة مطلوبة" })
      .int()
      .gte(2000, { message: "السنة يجب أن تكون بعد 2000" })
      .lte(currentYear, { message: "السنة يجب أن لا تتجاوز السنة الحالية" })
      .refine((val) => val.toString().length === 4, {
        message: "السنة يجب أن تتكون من 4 أرقام",
      })
  ),

  leaveAddress: z.string({
    required_error: "عنوان المقر السكني طيلة العطلة مطلوب",
  }),

  postalCode: z.string().max(5, "الرمز البريدي يجب أن لا يتجاوز 5 أرقام"),

  phone: phoneSchema,

  attachedDocs: z.string().optional(),
});

export const createLeaveRequestSchema = baseLeaveRequestSchema
  .refine((data) => data.durationFrom >= today, {
    message: "تاريخ بداية الإجازة يجب أن يكون اليوم أو بعده",
    path: ["durationFrom"],
  })
  .refine((data) => data.durationTo > data.durationFrom, {
    message: "تاريخ نهاية الإجازة يجب أن يكون بعد تاريخ البداية",
    path: ["durationTo"],
  });

export const updateLeaveRequestSchema = baseLeaveRequestSchema
  .extend({
    requestId: z.string({
      required_error: "معرّف الطلب مطلوب",
      invalid_type_error: "معرّف الطلب يجب أن يكون نصًا",
    }),
  })
  .refine((data) => data.durationFrom >= today, {
    message: "تاريخ بداية الإجازة يجب أن يكون اليوم أو بعده",
    path: ["durationFrom"],
  })
  .refine((data) => data.durationTo > data.durationFrom, {
    message: "تاريخ نهاية الإجازة يجب أن يكون بعد تاريخ البداية",
    path: ["durationTo"],
  });

export const CancelRequestFormSchema = z.object({
  userId: z.string(),
  requestId: z.string(),
  full_name: z.string(),
  confirm_full_name: z.string(),
});
