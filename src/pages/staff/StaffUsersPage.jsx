import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  Users as UsersIcon,
  Loader2,
} from "lucide-react";
import { useUsersList, useToggleUserActive } from "@/hooks/useUsers";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import UserFormDialog from "@/components/user/UserFormDialog";
import DeleteUserDialog from "@/components/user/DeleteUserDialog";

export default function StaffUsersPage({ role, title, description, addLabel, emptyLabel }) {
  const { authUser } = useAuthUser();
  const [search, setSearch] = useState("");
  const [formTarget, setFormTarget] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: users = [], isLoading } = useUsersList({
    role,
    search: search || undefined,
  });

  const { mutate: toggleActive, isPending: isToggling } = useToggleUserActive();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const openCreate = () => {
    setFormTarget(null);
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setFormTarget(user);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{emptyLabel}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user.id === authUser?.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt={user.fullName} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {user.phone || "—"}
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            Đang hoạt động
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                            Đã khóa
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleActive(user.id)}
                              disabled={isToggling || isSelf}
                            >
                              {user.isActive ? (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Khóa tài khoản
                                </>
                              ) : (
                                <>
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Mở khóa
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setDeleteTarget(user)}
                              disabled={isSelf}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        user={formTarget}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        lockRole={role}
      />

      <DeleteUserDialog
        user={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
