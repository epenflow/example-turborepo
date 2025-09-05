import * as z from "zod/v4";

import { userCredentialsSchema, userInfoSchema } from "../users";

export const signInSchema = z.object({
  email: userCredentialsSchema.shape.email,
  password: z.string().min(1, "The password field must be defined"),
});

export const updateAccountSchema = userInfoSchema.extend(
  userCredentialsSchema.omit({ password: true }).shape,
);

export const forgotPasswordSchema = z.object({
  email: userCredentialsSchema.shape.email,
});

const newPasswordSchema = z.object({
  new: userCredentialsSchema.shape.password,
  confirm: z.string(),
});

const withNewPasswordRefine = <
  T extends z.ZodObject<typeof newPasswordSchema.shape>,
>(
  schema: T,
) =>
  schema.refine((data) => data.confirm === data.new, {
    message:
      "The confirm password field and new password field must be the same",
    path: ["confirm"],
  });

export const resetPasswordSchema = withNewPasswordRefine(newPasswordSchema);
export const changePasswordSchema = withNewPasswordRefine(
  newPasswordSchema.extend({
    current: z.string().min(1, "The current password field must be defined"),
  }),
);

export const deleteAccountSchema = z.object({
  password: signInSchema.shape.password,
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>;
