import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile } from "../../lib/api";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      toast.success(res?.message || "Cập nhật thông tin thành công");
      // Backend trả { success, message, user } — đồng bộ shape với /auth/me
      // để navbar / sidebar lấy user mới mà không cần refetch.
      queryClient.setQueryData(["authUser"], { user: res?.user });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    },
  });

  return { updateProfileMutation: mutate, isPending, error };
};

export default useUpdateProfile;
