import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";

import { useFieldItem } from "./field-item";

export default function FieldControl({
  ...props
}: ComponentProps<typeof Slot>) {
  const { isError, fieldControlId } = useFieldItem();

  return (
    <Slot
      id={fieldControlId}
      aria-describedby={isError ? `${fieldControlId}-error` : fieldControlId}
      aria-invalid={isError}
      {...props}
    />
  );
}
