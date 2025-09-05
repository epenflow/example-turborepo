import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import type { CreateUserSchema } from "../users";
import { authQueries } from "./queries";
import {
  type ChangePasswordSchema,
  type DeleteAccountSchema,
  type ForgotPasswordSchema,
  type ResetPasswordSchema,
  type SignInSchema,
  type UpdateAccountSchema,
} from "./schema";
import { authRevokeSessionFn, authUpdateSessionFn } from "./server";
import { tuyau } from "~/integrations/tuyau-client";
import type { FileRouteTypes } from "~/routeTree.gen";

const MUTATION_KEY = {
  signIn: ["auth", "sign-in"],
  signOut: ["auth", "sign-out"],
  signUp: ["auth", "sign-up"],
  forgotPassword: ["auth", "forgot-password"],
  resetPassword: ["auth", "reset-password"],
  changePassword: ["auth", "change-password"],
  updateAccount: ["auth", "update-account"],
  deleteAccount: ["auth", "delete-account"],
} as const;

export function useSignIn(redirectTo?: FileRouteTypes["to"]) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateSession = useServerFn(authUpdateSessionFn);
  const sessionKey = authQueries.session.queryKey;

  return useMutation({
    mutationKey: MUTATION_KEY.signIn,
    mutationFn: (data: SignInSchema) =>
      tuyau.auth["sign-in"].$post(data).unwrap(),
    onSuccess: async (data) => {
      const res = await updateSession({ data });
      if (res.success) {
        queryClient.setQueryData(sessionKey, {
          ...data,
          status: "AUTHENTICATED",
        });

        if (redirectTo) {
          router.navigate({ to: redirectTo });
        } else {
          router.invalidate();
        }
      }
    },
  });
}

export function useSignUp(redirectTo?: FileRouteTypes["to"]) {
  const router = useRouter();
  return useMutation({
    mutationKey: MUTATION_KEY.signUp,
    mutationFn: (data: CreateUserSchema) =>
      tuyau.auth["sign-up"].$post(data).unwrap(),
    onSuccess: (data) => {
      toast.success(data.message);

      if (redirectTo) {
        router.navigate({ to: redirectTo });
      }
    },
  });
}

export function useSignOut(redirectTo?: FileRouteTypes["to"]) {
  const router = useRouter();
  const revokeSession = useServerFn(authRevokeSessionFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEY.signOut,
    mutationFn: () => tuyau.auth["sign-out"].$delete().unwrap(),
    onSuccess: async () => {
      const res = await revokeSession();
      if (res.success) {
        queryClient.clear();
        if (redirectTo) {
          router.navigate({ to: redirectTo });
        } else {
          router.invalidate();
        }
      }
    },
  });
}

export function useAuthSession() {
  const { data } = useSuspenseQuery(authQueries.session);

  return data;
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: MUTATION_KEY.forgotPassword,
    mutationFn: (data: ForgotPasswordSchema) =>
      tuyau.auth["forgot-password"].$post(data).unwrap(),
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
}

export function useResetPassword(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authSession = useAuthSession();
  const { mutateAsync } = useSignOut();
  const revokeSession = useServerFn(authRevokeSessionFn);

  return useMutation({
    mutationKey: MUTATION_KEY.resetPassword,
    mutationFn: (data: ResetPasswordSchema) =>
      tuyau.auth["reset-password"]
        .$post(data, {
          headers: {
            "X-Password-Reset-Token": token,
          },
        })
        .unwrap(),
    onSuccess: async (data) => {
      toast.success(data.message);
      if (authSession.status === "AUTHENTICATED") {
        await mutateAsync();
      } else {
        await revokeSession();
      }

      queryClient.clear();

      router.navigate({ to: "/sign-in" });
    },
  });
}

export function useChangePassword() {
  const { mutateAsync } = useSignOut();

  return useMutation({
    mutationKey: MUTATION_KEY.changePassword,
    mutationFn: (data: ChangePasswordSchema) =>
      tuyau.auth["change-password"].$post(data).unwrap(),
    onSuccess: async (data) => {
      toast.success(data.message);
      await mutateAsync();
    },
  });
}

export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const revokeSession = useServerFn(authRevokeSessionFn);

  return useMutation({
    mutationKey: MUTATION_KEY.deleteAccount,
    mutationFn: (data: DeleteAccountSchema) =>
      tuyau.auth["delete-account"].$post(data).unwrap(),
    onSuccess: async () => {
      const res = await revokeSession();
      if (res.success) {
        toast.success("Account deleted successfully");
        queryClient.clear();
        router.invalidate();
      }
    },
  });
}
export function useUpdateAccount() {
  const updateSession = useServerFn(authUpdateSessionFn);
  const sessionKey = authQueries.session.queryKey;
  const meKey = authQueries.me.queryKey;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEY.updateAccount,
    mutationFn: (data: UpdateAccountSchema) =>
      tuyau.auth["update-account"].$post(data).unwrap(),
    onSuccess: async (data) => {
      const res = await updateSession({
        data: {
          currentUser: data.currentUser,
        },
      });

      if (res.success) {
        queryClient.setQueryData(meKey, (prev) => ({
          ...prev,
          currentUser: data.currentUser,
        }));

        queryClient.setQueryData(sessionKey, (prev) => ({
          ...prev,
          currentUser: data.currentUser,
          status: prev?.status ?? "AUTHENTICATED",
        }));

        toast.success(data.message);
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: meKey });
      queryClient.invalidateQueries({ queryKey: sessionKey });
    },
  });
}
