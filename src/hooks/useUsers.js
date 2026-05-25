import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActive,
} from "@/lib/api";

export const useUsersList = (params) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    select: (resp) => resp?.data ?? [],
  });
};

export const useUserDetail = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    select: (resp) => resp?.data ?? null,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res?.message || "Tạo người dùng thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      toast.success(res?.message || "Cập nhật thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res?.message || "Đã xóa người dùng");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useToggleUserActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleUserActive,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res?.message || "Đã cập nhật trạng thái");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};
