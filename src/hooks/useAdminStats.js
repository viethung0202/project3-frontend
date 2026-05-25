import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/api";

const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    select: (resp) => resp?.data ?? null,
  });
};

export default useAdminStats;
