import { PasswordInput } from "~/components/ui";
import { useAppForm } from "~/hooks/form";
import { tuyauOnSubmit } from "~/integrations/tuyau-client";
import * as AuthService from "~/services/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const { mutateAsync } = AuthService.useResetPassword(token);

  const { AppForm, AppField, Form, FormSubmitButton, FormError } = useAppForm({
    defaultValues: {
      new: "",
      confirm: "",
    },
    validators: {
      onChange: AuthService.resetPasswordSchema,
    },
    onSubmit: tuyauOnSubmit(mutateAsync),
  });

  return (
    <AppForm>
      <Form>
        <AppField
          name="new"
          children={({
            FieldItem,
            FieldControl,
            FieldError,
            FieldLabel,
            state,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <PasswordInput
                  placeholder="******"
                  autoComplete="new-password"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />

        <AppField
          name="confirm"
          children={({
            FieldItem,
            FieldControl,
            FieldError,
            FieldLabel,
            state,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Confirm Password</FieldLabel>
              <FieldControl>
                <PasswordInput
                  placeholder="******"
                  autoComplete="new-password"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />
        <FormError />
        <FormSubmitButton>Reset Password</FormSubmitButton>
      </Form>
    </AppForm>
  );
}
