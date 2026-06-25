import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  reviewDocument,
  deleteMyDocumentReview,
} from "@/lib/api";

export const useDocuments = (params = {}) => {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => getDocuments(params),
    select: (resp) => resp?.data ?? [],
  });
};

export const useDocumentDetail = (id) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentById(id),
    enabled: !!id,
    select: (resp) => resp?.data ?? null,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDocument,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success(res?.message || "Tải lên thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Tải lên thất bại"),
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDocument,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document"] });
      toast.success(res?.message || "Cập nhật thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Cập nhật thất bại"),
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success(res?.message || "Đã xóa");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa thất bại"),
  });
};

export const useReviewDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewDocument,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document"] });
      toast.success(res?.message || "Đã lưu đánh giá");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Lưu đánh giá thất bại"),
  });
};

export const useDeleteMyDocumentReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMyDocumentReview,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document"] });
      toast.success(res?.message || "Đã xóa đánh giá");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa đánh giá thất bại"),
  });
};
