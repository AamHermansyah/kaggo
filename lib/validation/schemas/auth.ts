import { z } from "zod"

import { isValidPhone, normalizePhone, PHONE_ERROR } from "../phone"

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"))
  .transform((value) => value.toLowerCase())

/**
 * Sign-in only checks that something was typed. Strength rules belong on
 * registration — telling a returning user their existing password is "too
 * short" is noise, and a length hint on the login screen leaks policy.
 */
const existingPassword = z.string().min(1, "Password is required").max(200)

const newPassword = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(200, "Keep it under 200 characters")

export const adminLoginSchema = z.object({
  email,
  password: existingPassword,
})

export type AdminLoginValues = z.input<typeof adminLoginSchema>

export const companyLoginSchema = z.object({
  email,
  password: existingPassword,
})

export type CompanyLoginValues = z.input<typeof companyLoginSchema>

export const companyRegisterSchema = z
  .object({
    name: z.string().trim().min(2, "Company name is required").max(200),
    address: z.string().trim().min(5, "Company address is required").max(300),
    email,
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .refine(isValidPhone, PHONE_ERROR)
      .transform((value) => normalizePhone(value)!),
    password: newPassword,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type CompanyRegisterValues = z.input<typeof companyRegisterSchema>
