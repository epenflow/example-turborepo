import * as z from "zod/v4";

export const userInfoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.date("The dob field must be a datetime value").optional(),
  avatar: z.file().optional(),
});
export const userCredentialsSchema = z.object({
  username: z
    .string("The username field must be defined")
    .regex(
      /^[a-z0-9._]+$/,
      "The username field can only contain lowercase letters, numbers, underscore, or periods",
    ),
  email: z.email("The email field must be a valid email address"),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/,
      "The password field must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    )
    .min(4, "The password field must be at least 4 characters long"),
});

export const updateUserSchema = userInfoSchema.extend({
  ...userCredentialsSchema.shape,
  password: userCredentialsSchema.shape.password.optional(),
});

export const createUserSchema = userInfoSchema.extend(
  userCredentialsSchema.shape,
);

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
