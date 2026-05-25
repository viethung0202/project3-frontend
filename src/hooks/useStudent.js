import { useQuery } from "@tanstack/react-query";
import { getStudentStats, getStudentCourses } from "@/lib/api";

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
