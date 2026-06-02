import { useQuery } from "@tanstack/react-query";
import {
  getStudentStats,
  getStudentCourses,
  getStudentQuizHistory,
  getStudentProgress,
} from "@/lib/api";

export const useStudentStats = () => {
  return useQuery({
    queryKey: ["student-stats"],
    queryFn: getStudentStats,
    select: (resp) => resp?.data ?? null,
  });
};

export const useStudentCourses = () => {
  return useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getStudentCourses,
    select: (resp) => resp?.data ?? [],
  });
};

export const useStudentQuizHistory = () => {
  return useQuery({
    queryKey: ["student-quiz-history"],
    queryFn: getStudentQuizHistory,
    select: (resp) => resp?.data ?? [],
  });
};

export const useStudentProgress = () => {
  return useQuery({
    queryKey: ["student-progress"],
    queryFn: getStudentProgress,
    select: (resp) => resp?.data ?? [],
  });
};
