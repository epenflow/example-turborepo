import { type ComponentProps } from "react";

import { useFormContext } from "~/hooks/form";
import { cn } from "~/lib/utils";

export default function Form({
  className,
  onSubmit,
  ...props
}: ComponentProps<"form">) {
  const { handleSubmit } = useFormContext();

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
        onSubmit?.(e);
      }}
      {...props}
    />
  );
}
