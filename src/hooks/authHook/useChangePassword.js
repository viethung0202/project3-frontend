import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { changePassword } from "../../lib/api";

const useChangePassword = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      toast.success(res?.message || "Đổi mật khẩu thành công");
      // Backend đã clear cookie token → user bị logout. Reset cache authUser
      // rồi đẩy về trang đăng nhập để login lại bằng mật khẩu mới.
      queryClient.setQueryData(["authUser"], null);
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Đổi mật khẩu thất bại, thử lại sau",
      );
    },
  });

  return { changePasswordMutation: mutate, isPending, error };
};

export default useChangePassword;
