import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { ROLE_LABELS } from "@/utils/constants";

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "STUDENT",
};

export default function UserFormDialog({ user, open, onClose, lockRole }) {
  const isEdit = !!user;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setForm(
        user
          ? {
              fullName: user.fullName || "",
              email: user.email || "",
              phone: user.phone || "",
              password: "",
              role: user.role || lockRole || "STUDENT",
            }
          : { ...EMPTY, role: lockRole || EMPTY.role },
      );
      setErrors({});
      setShowPw(false);
    }
  }, [user, open, lockRole]);

  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    else if (form.fullName.trim().length < 2)
      e.fullName = "Họ tên phải có ít nhất 2 ký tự";

    if (!isEdit) {
      if (!form.email.trim()) e.email = "Vui lòng nhập email";
      else if (!/^\S+@\S+\.\S+$/.test(form.email))
        e.email = "Email không hợp lệ";

      if (!form.password) e.password = "Vui lòng nhập mật khẩu";
      else if (form.password.length < 6)
        e.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (form.phone && !/^[0-9+\-\s]{8,15}$/.test(form.phone))
      e.phone = "Số điện thoại không hợp lệ";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      // PUT /users/:id dùng FormData vì backend có middleware upload.single('avatar')
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("phone", form.phone);
      fd.append("role", form.role);
      updateUser({ id: user.id, formData: fd }, { onSuccess: onClose });
    } else {
      createUser(
        {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa người dùng" : "Tạo người dùng mới"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin và vai trò của người dùng."
              : "Tạo tài khoản cho nhân viên, giáo viên hoặc học sinh."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              disabled={isPending}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email {!isEdit && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              disabled={isPending || isEdit}
              className={isEdit ? "bg-gray-50" : ""}
              aria-invalid={!!errors.email}
            />
            {isEdit && (
              <p className="text-xs text-gray-500">Email không thể thay đổi</p>
            )}
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              placeholder="0901234567"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              disabled={isPending}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          {!lockRole && (
            <div className="space-y-2">
              <Label htmlFor="role">
                Vai trò <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.role}
                onValueChange={(v) => setField("role", v)}
                disabled={isPending}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Ít nhất 6 ký tự"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  disabled={isPending}
                  className="pr-10"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPw ? "Ẩn" : "Hiện"}
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : isEdit ? (
                "Cập nhật"
              ) : (
                "Tạo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
