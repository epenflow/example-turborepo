import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";

import {
  Button,
  Calendar,
  Input,
  PasswordInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui";
import { useAppForm } from "~/hooks/form";
import { tuyauOnSubmit } from "~/integrations/tuyau-client";
import { cn } from "~/lib/utils";
import * as AuthService from "~/services/auth";
import * as UserService from "~/services/users";

export function SignUpForm() {
  const { mutateAsync } = AuthService.useSignUp("/sign-in");

  const { AppForm, AppField, Form, FormError, FormSubmitButton } = useAppForm({
    defaultValues: {
      password: "",
    } as UserService.CreateUserSchema,
    validators: {
      onChange: UserService.createUserSchema,
    },
    onSubmit: tuyauOnSubmit(mutateAsync),
  });

  return (
    <AppForm>
      <Form>
        <div className="grid grid-cols-2 gap-2">
          <AppField
            name="firstName"
            children={({
              FieldItem,
              FieldControl,
              FieldLabel,
              FieldError,
              handleChange,
            }) => (
              <FieldItem>
                <FieldLabel>First Name</FieldLabel>
                <FieldControl>
                  <Input onChange={(e) => handleChange(e.target.value)} />
                </FieldControl>
                <FieldError />
              </FieldItem>
            )}
          />

          <AppField
            name="lastName"
            children={({
              FieldItem,
              FieldControl,
              FieldLabel,
              FieldError,
              handleChange,
            }) => (
              <FieldItem>
                <FieldLabel>Last Name</FieldLabel>
                <FieldControl>
                  <Input onChange={(e) => handleChange(e.target.value)} />
                </FieldControl>
                <FieldError />
              </FieldItem>
            )}
          />
        </div>

        <AppField
          name="username"
          children={({
            FieldItem,
            FieldControl,
            FieldLabel,
            FieldError,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Username</FieldLabel>
              <FieldControl>
                <Input
                  autoComplete="username"
                  onChange={(e) => handleChange(e.target.value)}
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />
        <AppField
          name="email"
          children={({
            FieldItem,
            FieldControl,
            FieldLabel,
            FieldError,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input
                  autoComplete="email"
                  onChange={(e) => handleChange(e.target.value)}
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />

        <AppField
          name="dob"
          children={({
            FieldItem,
            FieldControl,
            FieldLabel,
            FieldError,
            state,
            handleChange,
          }) => (
            <FieldItem className="flex flex-col">
              <FieldLabel>Date of Birth</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FieldControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !state.value && "text-muted-foreground",
                      )}>
                      {state.value ? (
                        DateTime.fromJSDate(state.value).toLocaleString(
                          DateTime.DATE_FULL,
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FieldControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={state.value}
                    onSelect={handleChange}
                    captionLayout="dropdown"
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FieldError />
            </FieldItem>
          )}
        />

        <AppField
          name="password"
          children={({
            FieldItem,
            FieldControl,
            FieldLabel,
            FieldError,
            handleChange,
            state,
          }) => (
            <FieldItem>
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <PasswordInput
                  value={state.value}
                  placeholder="******"
                  autoComplete="new-password"
                  onChange={(e) => handleChange(e.target.value)}
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />
        <FormError />
        <FormSubmitButton className="w-full">Sign-Up</FormSubmitButton>
      </Form>
    </AppForm>
  );
}
