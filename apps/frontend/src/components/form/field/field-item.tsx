/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useId, type ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import type { StandardSchemaV1Issue } from "@tanstack/react-form";
import * as z from "zod/v4";

import { useFieldContext } from "~/hooks/form";
import { cn } from "~/lib/utils";

export type FieldItemValues = {
  id: string;
  name: string;
  isError: boolean;
  errors: z.core.$ZodIssue[] | StandardSchemaV1Issue[];
  fieldId: string;
  fieldControlId: string;
  fieldMessageId: string;
};

type FieldItemProps = ComponentProps<"div"> & {
  asChild?: boolean;
};

const FieldItemContext = createContext<FieldItemValues | undefined>(undefined);

export default function FieldItem({
  className,
  asChild = false,
  ...props
}: FieldItemProps) {
  const id = useId();
  const { name, state } = useFieldContext();

  const Comp = asChild ? Slot : "div";

  return (
    <FieldItemContext
      value={{
        id: id,
        name: name,
        errors: state.meta.errors,
        isError: state.meta.errors.length > 0,
        fieldId: `${id}-${name}`,
        fieldControlId: `${id}-${name}-control`,
        fieldMessageId: `${id}-${name}-message`,
      }}>
      <Comp id={id} className={cn("space-y-2", className)} {...props} />
    </FieldItemContext>
  );
}

export function useFieldItem() {
  const context = useContext(FieldItemContext);

  if (!context) {
    throw new Error(
      "useFieldItem() should be used within <FieldItemContext />",
    );
  }

  return context;
}
