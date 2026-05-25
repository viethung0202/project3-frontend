import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { selfEnroll } from "@/lib/api";

const useStudentEnroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selfEnroll,
    onSuccess: (res) => {
      // Invalidate để các page browse / dashboard / my-courses refresh
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
      toast.success(res?.message || "Đăng ký khóa học thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Đăng ký thất bại"),
  });
};

export default useStudentEnroll;
