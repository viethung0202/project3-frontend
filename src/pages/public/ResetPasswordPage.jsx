import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { verifyResetToken, resetPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100, "Mật khẩu quá dài"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: verifyData, isLoading: verifying } = useQuery({
    queryKey: ["verifyResetToken", token],
    queryFn: () => verifyResetToken(token),
    enabled: !!token,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: ({ newPassword }) => resetPassword({ token, newPassword }),
    onSuccess: () => {
      setSuccess(true);
      toast.success("Đặt lại mật khẩu thành công");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Đặt lại mật khẩu thất bại",
      );
    },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EngCenter</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h1>
          <p className="text-sm text-gray-600 mt-1">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Không có token */}
            {!token && (
              <ErrorState
                title="Link không hợp lệ"
                message="Đường dẫn không có token. Hãy yêu cầu lại link đặt lại mật khẩu."
              />
            )}

            {/* Đang verify */}
            {token && verifying && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-sm text-gray-500 mt-3">
                  Đang kiểm tra link...
                </p>
              </div>
            )}

            {/* Token invalid */}
            {token && !verifying && !verifyData?.valid && (
              <ErrorState
                title={
                  verifyData?.reason === "expired"
                    ? "Link đã hết hạn"
                    : verifyData?.reason === "used"
                      ? "Link đã được sử dụng"
                      : "Link không hợp lệ"
                }
                message="Vui lòng yêu cầu lại link đặt lại mật khẩu."
              />
            )}

            {/* Success */}
            {success && (
              <div className="text-center py-4 space-y-4">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 mb-1">
                    Mật khẩu đã được đổi
                  </h2>
                  <p className="text-sm text-gray-600">
                    Bạn có thể đăng nhập với mật khẩu mới.
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Đăng nhập ngay
                </Button>
              </div>
            )}

            {/* Form */}
            {token && !verifying && verifyData?.valid && !success && (
              <form
                onSubmit={handleSubmit((d) => mutation.mutate(d))}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tối thiểu 6 ký tự"
                      autoComplete="new-password"
                      className="pl-9 pr-10"
                      aria-invalid={!!errors.newPassword}
                      {...register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Ẩn" : "Hiện"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-600">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
                      className="pl-9"
                      aria-invalid={!!errors.confirmPassword}
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ErrorState({ title, message }) {
  return (
    <div className="text-center py-4 space-y-4">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-100 text-red-600">
        <XCircle className="h-7 w-7" />
      </div>
      <div>
        <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <Button asChild variant="outline" className="w-full">
        <Link to="/forgot-password">Yêu cầu lại link</Link>
      </Button>
    </div>
  );
}
