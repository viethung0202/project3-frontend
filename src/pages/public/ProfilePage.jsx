import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import useUpdateProfile from "@/hooks/authHook/useUpdateProfile";
import useChangePassword from "@/hooks/authHook/useChangePassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, X, Eye, EyeOff, KeyRound } from "lucide-react";
import { ROLE_LABELS } from "@/utils/constants";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { authUser, isLoading } = useAuthUser();
  const { updateProfileMutation, isPending } = useUpdateProfile();

  const { changePasswordMutation, isPending: isChangingPassword } =
    useChangePassword();

  const [formData, setFormData] = useState({ fullName: "", phone: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  // Sync với authUser khi load xong
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        phone: authUser.phone || "",
      });
      setAvatarPreview(authUser.avatar || "");
    }
  }, [authUser]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "Vui lòng chọn file ảnh" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Ảnh tối đa 5MB" }));
      return;
    }

    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview(authUser?.avatar || "");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }
    if (formData.phone && !/^[0-9+\-\s]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("phone", formData.phone);
    if (avatarFile) {
      fd.append("avatar", avatarFile);
    }
    updateProfileMutation(fd, {
      onSuccess: () => setAvatarFile(null),
    });
  };

  const validatePassword = () => {
    const e = {};
    if (!pwForm.currentPassword) {
      e.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (!pwForm.newPassword) {
      e.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (pwForm.newPassword.length < 6) {
      e.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    } else if (pwForm.newPassword === pwForm.currentPassword) {
      e.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }
    if (pwForm.confirmPassword !== pwForm.newPassword) {
      e.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    changePasswordMutation({
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trang cá nhân</h1>
        <p className="text-gray-600 mt-1">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} alt={authUser.fullName} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                  {getInitials(authUser.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <label
                    htmlFor="avatar"
                    className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Upload className="h-4 w-4" />
                    Đổi ảnh
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isPending}
                  />
                  {avatarFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">PNG/JPG/WEBP, tối đa 5MB</p>
                {errors.avatar && (
                  <p className="text-xs text-red-600">{errors.avatar}</p>
                )}
              </div>
            </div>

            {/* Email + Role (readonly) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={authUser.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Vai trò</Label>
                <div className="h-9 flex items-center">
                  <Badge variant="secondary">
                    {ROLE_LABELS[authUser.role] || authUser.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* fullName */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, fullName: e.target.value }))
                }
                disabled={isPending}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="0901234567"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
                disabled={isPending}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isPending}
              >
                Quay lại
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Đổi mật khẩu */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5" />
            Đổi mật khẩu
          </CardTitle>
          <p className="text-sm text-gray-500">
            Sau khi đổi, bạn sẽ phải đăng nhập lại bằng mật khẩu mới.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <PasswordField
              id="currentPassword"
              label="Mật khẩu hiện tại"
              required
              value={pwForm.currentPassword}
              show={showPw.current}
              onToggle={() =>
                setShowPw((p) => ({ ...p, current: !p.current }))
              }
              onChange={(v) =>
                setPwForm((p) => ({ ...p, currentPassword: v }))
              }
              disabled={isChangingPassword}
              error={pwErrors.currentPassword}
              autoComplete="current-password"
            />

            <PasswordField
              id="newPassword"
              label="Mật khẩu mới"
              required
              value={pwForm.newPassword}
              show={showPw.next}
              onToggle={() => setShowPw((p) => ({ ...p, next: !p.next }))}
              onChange={(v) => setPwForm((p) => ({ ...p, newPassword: v }))}
              disabled={isChangingPassword}
              error={pwErrors.newPassword}
              placeholder="Ít nhất 6 ký tự"
              autoComplete="new-password"
            />

            <PasswordField
              id="confirmPassword"
              label="Xác nhận mật khẩu mới"
              required
              value={pwForm.confirmPassword}
              show={showPw.confirm}
              onToggle={() =>
                setShowPw((p) => ({ ...p, confirm: !p.confirm }))
              }
              onChange={(v) =>
                setPwForm((p) => ({ ...p, confirmPassword: v }))
              }
              disabled={isChangingPassword}
              error={pwErrors.confirmPassword}
              autoComplete="new-password"
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đổi...
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordField({
  id,
  label,
  required,
  value,
  show,
  onToggle,
  onChange,
  disabled,
  error,
  placeholder,
  autoComplete,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className="pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
