import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../lib/api";
import { useNavigate } from "react-router-dom"; // 1. Import này

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // 2. Gọi hook

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Hoặc key user của bạn
      navigate("/"); // Chuyển trang ngay tại đây
    },
    onError: (error) => {
      console.log("Lỗi logout:", error);
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
