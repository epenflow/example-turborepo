import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";

import type { UserDto } from "@repo/backend/dtos";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Calendar,
  Input,
  PasswordInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui";
import { useAppForm, useAvatarPreview } from "~/hooks";
import { tuyauOnSubmit } from "~/integrations/tuyau-client";
import { cn, getFileAndUrl } from "~/lib/utils";
import * as UsersService from "~/services/users";
import { useUpdateUser } from "~/services/users/hooks";

export function UpdateUserForm({ user }: { user: UserDto }) {
  const { mutateAsync } = useUpdateUser(user.id);
  const [previewAvatar, setPreviewAvatar] = useAvatarPreview(user.avatar);

  const {
    AppForm,
    AppField,
    Form,
    FormSubmitButton,
    FormError,
    FormResetButton,
  } = useAppForm({
    defaultValues: {
      ...user,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      dob: user.dob ? DateTime.fromISO(user.dob).toJSDate() : undefined,
      avatar: undefined,
    } as UsersService.UpdateUserSchema,
    validators: {
      onChange: UsersService.updateUserSchema,
    },
    onSubmit: tuyauOnSubmit(mutateAsync),
  });

  return (
    <AppForm>
      <Form>
        <AppField
          name="avatar"
          children={({
            FieldControl,
            FieldItem,
            FieldLabel,
            FieldError,
            handleChange,
          }) => (
            <div className="space-y-2">
              <Avatar className="size-24 mx-auto">
                <AvatarImage src={previewAvatar} />
                <AvatarFallback>{user.initialName}</AvatarFallback>
              </Avatar>

              <FieldItem>
                <FieldLabel>Avatar</FieldLabel>
                <FieldControl>
                  <Input
                    onChange={(e) => {
                      const [avatar, avatarUrl] = getFileAndUrl(e);
                      setPreviewAvatar(avatarUrl[0]);
                      handleChange(avatar[0]);
                    }}
                    type="file"
                  />
                </FieldControl>
                <FieldError />
              </FieldItem>
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <AppField
            name="firstName"
            children={({
              FieldItem,
              FieldControl,
              FieldLabel,
              FieldError,
              state,
              handleChange,
            }) => (
              <FieldItem>
                <FieldLabel>First Name</FieldLabel>
                <FieldControl>
                  <Input
                    onChange={(e) => handleChange(e.target.value)}
                    value={state.value}
                  />
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
              state,
              handleChange,
            }) => (
              <FieldItem>
                <FieldLabel>Last Name</FieldLabel>
                <FieldControl>
                  <Input
                    onChange={(e) => handleChange(e.target.value)}
                    value={state.value}
                  />
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
            state,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Username</FieldLabel>
              <FieldControl>
                <Input
                  onChange={(e) => handleChange(e.target.value)}
                  autoComplete="username"
                  value={state.value}
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
            state,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input
                  onChange={(e) => handleChange(e.target.value)}
                  autoComplete="email"
                  value={state.value}
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
            FieldError,
            FieldLabel,
            state,
            handleChange,
          }) => (
            <FieldItem>
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <PasswordInput
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="******"
                  autoComplete="new-password"
                  value={state.value || ""}
                />
              </FieldControl>
              <FieldError />
            </FieldItem>
          )}
        />
        <FormError />
        <div className="inline-flex items-center gap-2">
          <FormSubmitButton>Save</FormSubmitButton>
          <FormResetButton>Reset</FormResetButton>
        </div>
      </Form>
    </AppForm>
  );
}
