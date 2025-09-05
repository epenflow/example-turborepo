import { Input } from "~/components/ui";
import { useAppForm } from "~/hooks/form";
import { tuyauOnSubmit } from "~/integrations/tuyau-client";
import * as AuthService from "~/services/auth";

export function ForgotPasswordForm() {
  const { mutateAsync } = AuthService.useForgotPassword();

  const { AppForm, AppField, Form, FormSubmitButton, FormError } = useAppForm({
    validators: {
      onChange: AuthService.forgotPasswordSchema,
    },
    onSubmit: tuyauOnSubmit(mutateAsync),
  });

  return (
    <AppForm>
      <Form>
        <AppField
          name="email"
          children={({
            FieldItem,
            FieldControl,
            FieldError,
            FieldLabel,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="johndoe@mail.com"
                  autoComplete="email"
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />
        <FormError />
        <FormSubmitButton>Send Reset Link</FormSubmitButton>
      </Form>
    </AppForm>
  );
}
