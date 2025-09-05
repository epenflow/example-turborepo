import { AccessTokenDto, UserDto } from "@repo/backend/dtos";

export type AuthSession = {
  currentUser?: UserDto;
  accessToken?: AccessTokenDto;
};

export type AuthStatus = "AUTHENTICATED" | "UNAUTHENTICATED";
export type AuthSessionContext = AuthSession & {
  status: AuthStatus;
};
