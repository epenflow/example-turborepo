import type { ComponentProps } from "react";

import { useFieldItem } from "./field-item";
import { cn } from "~/lib/utils";

export default function FieldError({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  const { isError, errors, fieldMessageId } = useFieldItem();

  const body = isError
    ? errors.map((error) => error.message).join(", ")
    : children;

  if (!body) return;

  return (
    <p
      id={fieldMessageId}
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}>
      {body}
    </p>
  );
}
