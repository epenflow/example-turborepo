import { useFieldItem } from "./field-item";
import { Label, type LabelProps } from "~/components/ui";
import { cn } from "~/lib/utils";

export default function FieldLabel({ className, ...props }: LabelProps) {
  const { isError, fieldControlId } = useFieldItem();

  return (
    <Label
      htmlFor={fieldControlId}
      className={cn(isError && "text-destructive", className)}
      {...props}
    />
  );
}
