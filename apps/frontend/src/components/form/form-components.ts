import { lazy } from "react";

export default {
  Form: lazy(() => import("./form")),
  FormError: lazy(() => import("./form-error")),
  FormSubmitButton: lazy(() => import("./form-submit-button")),
  FormResetButton: lazy(() => import("./form-reset-button")),
};
