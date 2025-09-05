import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { usersQueries } from "./queries";
import type { UpdateUserSchema } from "./schema";
import { tuyau } from "~/integrations/tuyau-client";
import type { UniqueIdentifier } from "~/shared/types";

export function useUpdateUser(id: UniqueIdentifier) {
  const queryClient = useQueryClient();
  const allQueryKey = usersQueries.all.queryKey;
  const detailQueryKey = usersQueries.detail(id).queryKey;

  return useMutation({
    mutationKey: ["users", "update", String(id)],
    mutationFn: (data: UpdateUserSchema) =>
      tuyau.api.users({ id }).$patch(data).unwrap(),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: allQueryKey });
      await queryClient.cancelQueries({ queryKey: detailQueryKey });

      const prevAllData = queryClient.getQueryData(allQueryKey);
      const prevDetailData = queryClient.getQueryData(detailQueryKey);

      queryClient.setQueryData(allQueryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  ...data,
                  dob: data.dob ? data.dob.toISOString() : null,
                }
              : user,
          ),
        };
      });

      queryClient.setQueryData(detailQueryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            ...data,
            dob: data.dob ? data.dob.toISOString() : null,
          },
        };
      });

      return { prevAllData, prevDetailData };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prevAllData) {
        queryClient.setQueryData(allQueryKey, ctx.prevAllData);
      }
      if (ctx?.prevDetailData) {
        queryClient.setQueryData(detailQueryKey, ctx.prevDetailData);
      }
      toast.error("Failed to update user. Please try again.");
    },
    onSuccess: (data) => {
      queryClient.setQueryData(allQueryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((user) =>
            user.id === data.user.id ? data.user : user,
          ),
        };
      });
      queryClient.setQueryData(detailQueryKey, (prev) => {
        if (!prev) {
          return { user: data.user };
        }
        return {
          ...prev,
          user: data.user,
        };
      });

      toast.success(data.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: allQueryKey });
      queryClient.invalidateQueries({ queryKey: detailQueryKey });
    },
  });
}

export function useDeleteUser(id: UniqueIdentifier) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const allQueryKey = usersQueries.all.queryKey;
  const detailQueryKey = usersQueries.detail(id).queryKey;

  return useMutation({
    mutationKey: ["users", "delete", String(id)],
    mutationFn: () => tuyau.api.users({ id }).$delete().unwrap(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: allQueryKey });
      await queryClient.cancelQueries({ queryKey: detailQueryKey });

      const prevAllData = queryClient.getQueryData(allQueryKey);
      const prevDetailData = queryClient.getQueryData(detailQueryKey);

      queryClient.setQueryData(allQueryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.filter((user) => user.id !== id),
        };
      });

      queryClient.removeQueries({ queryKey: detailQueryKey });

      return { prevAllData, prevDetailData };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prevAllData) {
        queryClient.setQueryData(allQueryKey, ctx.prevAllData);
      }
      if (ctx?.prevDetailData) {
        queryClient.setQueryData(detailQueryKey, ctx.prevDetailData);
      }
      toast.error("Failed to delete user. Please try again.");
    },
    onSuccess: (data) => {
      toast.success(data.message);

      router.navigate({ to: "/users" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: allQueryKey });
    },
  });
}
