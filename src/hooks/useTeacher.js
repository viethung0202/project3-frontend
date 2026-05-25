import { useQuery } from "@tanstack/react-query";
import {
  getTeacherStats,
  getTeacherCourses,
  getTeacherCourseEnrollments,
} from "@/lib/api";

export const useTeacherStats = () => {
  return useQuery({
    queryKey: ["teacher-stats"],
    queryFn: getTeacherStats,
    select: (resp) => resp?.data ?? null,
  });
};

export const useTeacherCourses = () => {
  return useQuery({
    queryKey: ["teacher-courses"],
    queryFn: getTeacherCourses,
    select: (resp) => resp?.data ?? [],
  });
};

export const useTeacherCourseEnrollments = (courseId) => {
  return useQuery({
    queryKey: ["teacher-course-enrollments", courseId],
    queryFn: () => getTeacherCourseEnrollments(courseId),
    enabled: !!courseId,
    select: (resp) => resp?.data ?? [],
  });
};
