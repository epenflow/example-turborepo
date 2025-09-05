import type { ReactNode } from "react";

import { PasswordInput, type ButtonProps } from "~/components/ui";
import { useAppForm } from "~/hooks/form";
import { tuyauOnSubmit } from "~/integrations/tuyau-client";
import * as AuthService from "~/services/auth";

type DeleteAccountFormProps = {
  children?: (props: {
    FormSubmitButton: (props: ButtonProps) => ReactNode;
  }) => ReactNode;
};
export function DeleteAccountForm({ children }: DeleteAccountFormProps) {
  const { mutateAsync } = AuthService.useDeleteAccount();

  const { AppForm, AppField, Form, FormSubmitButton, FormError } = useAppForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onChange: AuthService.deleteAccountSchema,
    },
    onSubmit: tuyauOnSubmit(mutateAsync),
  });

  return (
    <AppForm>
      <Form>
        <AppField
          name="password"
          children={({
            FieldItem,
            FieldControl,
            FieldLabel,
            FieldError,
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
        <FormError />
        {children ? (
          children({
            FormSubmitButton,
          })
        ) : (
          <FormSubmitButton variant="destructive">
            Delete account
          </FormSubmitButton>
        )}
      </Form>
    </AppForm>
  );
}
