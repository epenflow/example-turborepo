import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import form from "~/components/form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { withForm, useAppForm } = createFormHook({
  formContext,
  fieldContext,
  ...form,
});
