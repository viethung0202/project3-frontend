import { useQuery } from "@tanstack/react-query";
import { getStaffStats } from "@/lib/api";

const useStaffStats = () => {
  return useQuery({
    queryKey: ["staff-stats"],
    queryFn: getStaffStats,
    select: (resp) => resp?.data ?? null,
  });
};

export default useStaffStats;
