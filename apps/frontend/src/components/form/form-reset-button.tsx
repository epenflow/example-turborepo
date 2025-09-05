import { Button, type ButtonProps } from "../ui";
import { useFormContext } from "~/hooks/form";

export default function FormResetButton({ onClick, ...props }: ButtonProps) {
  const { reset, Subscribe } = useFormContext();

  return (
    <Subscribe
      selector={(state) => ({
        isDirty: state.isDirty,
        isSubmitted: state.isSubmitted,
        isSubmitting: state.isSubmitting,
        isSubmitSuccessful: state.isSubmitSuccessful,
      })}
      children={({ isDirty, isSubmitted, isSubmitting, isSubmitSuccessful }) =>
        (isDirty || (isSubmitted && !isSubmitSuccessful)) && !isSubmitting ? (
          <Button
            onClick={(e) => {
              reset();
              onClick?.(e);
            }}
            type="reset"
            {...props}
          />
        ) : null
      }
    />
  );
}
