import type { ComponentProps } from "react";

import { useFormContext } from "~/hooks/form";
import { cn } from "~/lib/utils";

export default function FormError({
  className,
  ...props
}: ComponentProps<"p">) {
  const { Subscribe } = useFormContext();

  return (
    <Subscribe
      selector={(state) => state.errorMap}
      children={(errorMap) =>
        errorMap.onSubmit ? (
          <p
            className={cn("text-xs font-medium text-destructive", className)}
            {...props}>
            {errorMap.onSubmit?.toString()}
          </p>
        ) : null
      }
    />
  );
}
