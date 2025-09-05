import { lazy } from "react";

export default {
  FieldItem: lazy(() => import("./field/field-item")),
  FieldControl: lazy(() => import("./field/field-control")),
  FieldLabel: lazy(() => import("./field/field-label")),
  FieldError: lazy(() => import("./field/field-error")),
};
