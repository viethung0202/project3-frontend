import { NavLink, Link, useNavigate } from "react-router-dom";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import useLogout from "@/hooks/authHook/useLogout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, LogOut, X } from "lucide-react";
import { MENU_BY_ROLE, ROLE_LABELS } from "@/utils/constants";
import { cn } from "@/lib/utils";

export default function Sidebar({ isOpen, onClose }) {
  const { authUser } = useAuthUser();
  const { logoutMutation, isPending: isLoggingOut } = useLogout();
  const navigate = useNavigate();

  // Lấy menu theo role
  const menuItems = MENU_BY_ROLE[authUser?.role] || [];

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col transition-transform md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header: Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gray-900">EngCenter</span>
          </Link>

          {/* Close button (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={authUser?.avatar} alt={authUser?.fullName} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                {getInitials(authUser?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {authUser?.fullName}
              </p>
              <Badge variant="secondary" className="text-xs mt-0.5 h-5">
                {ROLE_LABELS[authUser?.role]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to.split("/").length === 2}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100",
                    )
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <Separator />

        {/* Footer: Logout */}
        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => logoutMutation()}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-3 h-4 w-4" />
            {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
          </Button>
        </div>
      </aside>
    </>
  );
}
