import { PasswordInput } from "~/components/ui";
import { useAppForm } from "~/hooks/form";
import { tuyauOnSubmit } from "~/integrations/tuyau-client";
import { changePasswordSchema, useChangePassword } from "~/services/auth";

export function ChangePasswordForm() {
  const { mutateAsync } = useChangePassword();

  const {
    AppForm,
    AppField,
    Form,
    FormError,
    FormSubmitButton,
    FormResetButton,
  } = useAppForm({
    defaultValues: {
      new: "",
      confirm: "",
      current: "",
    },
    validators: {
      onChange: changePasswordSchema,
    },
    onSubmit: tuyauOnSubmit(mutateAsync),
  });

  return (
    <AppForm>
      <Form>
        <AppField
          name="current"
          children={({
            FieldItem,
            FieldControl,
            FieldLabel,
            FieldError,
            state,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Current Password</FieldLabel>
              <FieldControl>
                <PasswordInput
                  placeholder="******"
                  autoComplete="current-password"
                  onChange={(e) => handleChange(e.target.value)}
                  value={state.value}
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />

        <AppField
          name="new"
          children={({
            FieldItem,
            FieldControl,
            FieldLabel,
            FieldError,
            state,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>New Password</FieldLabel>
              <FieldControl>
                <PasswordInput
                  placeholder="******"
                  autoComplete="new-password"
                  onChange={(e) => handleChange(e.target.value)}
                  value={state.value}
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
            FieldLabel,
            FieldError,
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
        <div className="inline-flex items-center gap-2">
          <FormSubmitButton>Save</FormSubmitButton>
          <FormResetButton>Reset</FormResetButton>
        </div>
      </Form>
    </AppForm>
  );
}
