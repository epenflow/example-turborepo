import { Loader } from "lucide-react";

import { Button, type ButtonProps } from "../ui";
import { useFormContext } from "~/hooks/form";

export default function FormSubmitButton({ children, ...props }: ButtonProps) {
  const { Subscribe } = useFormContext();

  return (
    <Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
      children={({ canSubmit, isSubmitting }) => (
        <Button disabled={!canSubmit} type="submit" {...props}>
          {isSubmitting ? <Loader className="animate-spin" /> : children}
        </Button>
      )}
    />
  );
}
