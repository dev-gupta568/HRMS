import { z } from "zod";

const username = z
  .string()
  .trim()
  .min(1, "username is required")
  .refine(
    (value) => z.email().safeParse(value).success || /^EMP\d+$/i.test(value),
    "username must be a valid email or employee ID"
  );

export const loginSchema = z.object({
  username,
  password: z
    .string()
    .refine((value) => value.trim().length > 0, "password is required"),
});
