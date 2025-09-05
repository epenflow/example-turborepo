import { useState, type ComponentProps } from "react";
import { Eye, EyeClosed } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { cn } from "~/lib/utils";

export function PasswordInput({
  className,
  ...props
}: ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const disabled =
    props.value === "" || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2  hover:bg-transparent [&_>svg]:size-4"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}>
        {showPassword && !disabled ? (
          <Eye aria-hidden="true" />
        ) : (
          <EyeClosed aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>

      <style>{`
    .hide-password-toggle::-ms-reveal,
  	.hide-password-toggle::-ms-clear {
	    visibility: hidden;
	    pointer-events: none;
	    display: none;
  	}
    `}</style>
    </div>
  );
}
