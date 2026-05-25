import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getModuleFlashcardSets,
  getFlashcardSetById,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "@/lib/api";

// === FLASHCARD SETS ===
export const useModuleFlashcardSets = (moduleId) => {
  return useQuery({
    queryKey: ["module-flashcard-sets", moduleId],
    queryFn: () => getModuleFlashcardSets(moduleId),
    enabled: !!moduleId,
    // Backend trả { data: { module, flashcardSets } } → unwrap
    select: (resp) => resp?.data?.flashcardSets ?? [],
  });
};

export const useFlashcardSetDetail = (id) => {
  return useQuery({
    queryKey: ["flashcard-set", id],
    queryFn: () => getFlashcardSetById(id),
    enabled: !!id,
    select: (resp) => resp?.data ?? null,
  });
};

export const useCreateFlashcardSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFlashcardSet,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["module-flashcard-sets", variables.moduleId],
      });
      toast.success(res?.message || "Tạo bộ flashcard thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Tạo thất bại"),
  });
};

export const useUpdateFlashcardSet = (moduleId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFlashcardSet,
    onSuccess: (res, variables) => {
      if (moduleId)
        queryClient.invalidateQueries({
          queryKey: ["module-flashcard-sets", moduleId],
        });
      queryClient.invalidateQueries({
        queryKey: ["flashcard-set", variables.id],
      });
      toast.success(res?.message || "Cập nhật thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Cập nhật thất bại"),
  });
};

export const useDeleteFlashcardSet = (moduleId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFlashcardSet,
    onSuccess: (res) => {
      if (moduleId)
        queryClient.invalidateQueries({
          queryKey: ["module-flashcard-sets", moduleId],
        });
      toast.success(res?.message || "Đã xóa bộ flashcard");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa thất bại"),
  });
};

// === FLASHCARDS (cards trong set) ===
export const useCreateFlashcard = (setId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFlashcard,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["flashcard-set", setId] });
      toast.success(res?.message || "Tạo flashcard thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Tạo flashcard thất bại"),
  });
};

export const useUpdateFlashcard = (setId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFlashcard,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["flashcard-set", setId] });
      toast.success(res?.message || "Cập nhật flashcard thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Cập nhật thất bại"),
  });
};

export const useDeleteFlashcard = (setId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFlashcard,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["flashcard-set", setId] });
      toast.success(res?.message || "Đã xóa flashcard");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa thất bại"),
  });
};
