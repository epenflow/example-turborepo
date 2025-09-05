/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormApi } from "@tanstack/react-form";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import { TuyauHTTPError } from "@tuyau/client";

type OnSubmitProps<TFormData> = {
  value: TFormData;
  formApi: FormApi<TFormData, any, any, any, any, any, any, any, any, any, any>;
  meta: any;
};
type TuyauErrorObject = {
  field?: string;
  message: string;
};

export function tuyauOnSubmit<TData, TError, TVariables, TContext>(
  mutateAsync: UseMutateAsyncFunction<TData, TError, TVariables, TContext>,
) {
  return async ({ value, formApi }: OnSubmitProps<TVariables>) => {
    try {
      return await mutateAsync(value).then(() =>
        setTimeout(() => formApi.reset(), 100),
      );
    } catch (e) {
      const form: string[] = [];
      const fields: Record<string, unknown> = Object.create(null);

      console.log({ e });

      if (e instanceof TuyauHTTPError) {
        const [formsReporter, fieldsReporter] = errorReport(e);

        form.push(...formsReporter);
        Object.assign(fields, fieldsReporter);
      } else if (e instanceof Error) {
        form.push(e.message);
      } else {
        form.push("An unknown error occurred during submission.");
      }

      formApi.setErrorMap({
        onSubmit: {
          form,
          fields,
        },
      });
    }
  };
}

function errorReport(error: unknown): [string[], Record<string, unknown[]>] {
  const formErrors: string[] = [];
  const fieldErrors: Record<string, unknown[]> = Object.create(null);

  if (error instanceof TuyauHTTPError) {
    if (
      typeof error.value === "object" &&
      error.value !== null &&
      "errors" in error.value &&
      Array.isArray(error.value.errors)
    ) {
      for (const e of error.value.errors as TuyauErrorObject[]) {
        if ("field" in e && e.field) {
          if (!fieldErrors[e.field]) {
            fieldErrors[e.field] = [];
          }

          fieldErrors[e.field].push(e);
        } else {
          formErrors.push(e.message);
        }
      }
    } else {
      formErrors.push("An unexpected error occurred during form submission.");
    }
  }

  return [formErrors, fieldErrors];
}

export function isTuyauFormError(error: unknown): boolean {
  if (error instanceof TuyauHTTPError) {
    if (
      typeof error.value === "object" &&
      error.value !== null &&
      "errors" in error.value &&
      Array.isArray(error.value.errors)
    ) {
      // for (const e of error.value.errors as TuyauErrorObject[]) {
      //   if ("field" in e && e.field) {
      //     return true;
      //   } else {
      //     return true;
      //   }
      // }
      return true;
    }
    return false;
  }
  return false;
}
