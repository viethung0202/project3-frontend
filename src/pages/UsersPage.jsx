import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsersList } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Eye,
  Users,
  Loader2,
} from "lucide-react";
import DeleteUserDialog from "@/components/user/DeleteUserDialog";
import { ROLE_LABELS } from "@/utils/constants";
import useAuthUser from "@/hooks/useAuthUser";

export default function UsersPage() {
  const { authUser } = useAuthUser();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useUsersList({
    search,
    role: roleFilter !== "all" ? roleFilter : undefined,
  });

  const users = data?.data || data || [];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Tổng cộng: {users.length} người dùng
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/users/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo người dùng
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                <SelectItem value="ACADEMIC_STAFF">Giáo vụ</SelectItem>
                <SelectItem value="ADMIN_STAFF">Hành chính</SelectItem>
                <SelectItem value="TEACHER">Giáo viên</SelectItem>
                <SelectItem value="STUDENT">Học sinh</SelectItem>
              </SelectContent>
            </Select>
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
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Không có người dùng nào</p>
              <Button asChild>
                <Link to="/admin/users/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo người dùng đầu tiên
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isMe = user.id === authUser?.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={user.avatar}
                              alt={user.fullName}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {user.fullName}
                              {isMe && (
                                <Badge variant="outline" className="text-xs">
                                  Bạn
                                </Badge>
                              )}
                            </div>
                            {user.phone && (
                              <div className="text-xs text-gray-500">
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/users/${user.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/users/${user.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Sửa
                              </Link>
                            </DropdownMenuItem>
                            {!isMe && (
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setDeleteTarget(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            )}
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

      {/* Delete dialog */}
      <DeleteUserDialog
        user={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function RoleBadge({ role }) {
  const styles = {
    ADMIN: "bg-purple-100 text-purple-700",
    ACADEMIC_STAFF: "bg-blue-100 text-blue-700",
    ADMIN_STAFF: "bg-orange-100 text-orange-700",
    TEACHER: "bg-emerald-100 text-emerald-700",
    STUDENT: "bg-gray-100 text-gray-700",
  };
  return (
    <Badge className={`${styles[role]} hover:${styles[role]}`}>
      {ROLE_LABELS[role]}
    </Badge>
  );
}
