import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      // Set cache ngay để useAuthUser trả về user mới, tránh ProtectedRoute
      // thấy authUser=null (từ lần fetch trước khi login) và đá về /login.
      queryClient.setQueryData(["authUser"], { user: res?.data?.user });
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;
