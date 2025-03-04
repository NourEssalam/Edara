// We will move this later to a shared package for reusability in both nest js and next js
import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username must only contain alphanumeric characters"
    ),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const loginSchema = z.object({
  identifier: z.union([
    // Username validation
    z
      .string()
      .min(5, "Username must be at least 5 characters long")
      .regex(
        /^[a-zA-Z0-9]+$/,
        "Username must only contain alphanumeric characters"
      )
      .describe("username"),

    // Email validation
    z.string().email("Invalid email format").describe("email"),
  ]),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});
