import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const headingVariant = cva("", {
  variants: {
    variant: {
      default: "mb-8 space-y-0.5",
      small: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const titleVariant = cva("", {
  variants: {
    variant: {
      default: "text-xl font-semibold tracking-tight",
      small: "mb-0.5 text-base font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type HeadingProps = {
  title: string;
  description?: string | ReactNode;
} & VariantProps<typeof headingVariant>;

export function Heading({
  title,
  description,
  variant = "default",
}: HeadingProps) {
  return (
    <div className={cn(headingVariant({ variant }))}>
      <h6 className={cn(titleVariant({ variant }))}>{title}</h6>
      {typeof description === "string" ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : (
        description
      )}
    </div>
  );
}
