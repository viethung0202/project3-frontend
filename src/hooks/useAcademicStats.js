import { useQuery } from "@tanstack/react-query";
import { getAcademicStats } from "@/lib/api";

const useAcademicStats = () => {
  return useQuery({
    queryKey: ["academic-stats"],
    queryFn: getAcademicStats,
    select: (resp) => resp?.data ?? null,
  });
};

export default useAcademicStats;
