import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { forgotPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Loader2,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const schema = z.object({
  email: z.email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
});

export default function ForgotPasswordPage() {
  const [sentEmail, setSentEmail] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: (data) => forgotPassword(data.email),
    onSuccess: (_res, vars) => {
      setSentEmail(vars.email);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Yêu cầu thất bại, thử lại nhé",
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
          <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h1>
          <p className="text-sm text-gray-600 mt-1">
            Nhập email để nhận hướng dẫn đặt lại mật khẩu
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {sentEmail ? (
              <div className="text-center py-4 space-y-4">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 mb-1">
                    Đã gửi yêu cầu
                  </h2>
                  <p className="text-sm text-gray-600">
                    Nếu email <strong>{sentEmail}</strong> tồn tại trong hệ
                    thống, chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm
                    tra hộp thư (cả mục Spam).
                  </p>
                </div>
                <div className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  ⏱️ Link có hiệu lực trong vòng 1 giờ.
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSentEmail(null)}
                >
                  Gửi cho email khác
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit((d) => mutation.mutate(d))}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ban@example.com"
                      autoComplete="email"
                      className="pl-9"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600">
                      {errors.email.message}
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
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi yêu cầu"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
