import { Link } from "@tanstack/react-router";

import { Input, PasswordInput } from "~/components/ui";
import { useAppForm } from "~/hooks/form";
import { tuyauOnSubmit } from "~/integrations/tuyau-client";
import * as AuthService from "~/services/auth";

export function SignInForm() {
  const { mutateAsync } = AuthService.useSignIn();

  const { AppForm, AppField, Form, FormSubmitButton, FormError } = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChangeAsync: AuthService.signInSchema,
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
                <Input onChange={(e) => handleChange(e.target.value)} />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />

        <AppField
          name="password"
          children={({
            FieldItem,
            FieldControl,
            FieldError,
            FieldLabel,
            state,
            handleChange,
          }) => (
            <FieldItem>
              <div className="flex justify-between">
                <FieldLabel>Password</FieldLabel>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <FieldControl>
                <PasswordInput
                  placeholder="******"
                  autoComplete="current-password"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />
        <FormError />
        <FormSubmitButton className="w-full">Login</FormSubmitButton>
      </Form>
    </AppForm>
  );
}
