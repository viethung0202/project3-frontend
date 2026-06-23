import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  listContactMessages,
  updateContactStatus,
  deleteContactMessage,
  getContactStats,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Calendar,
  Loader2,
  Trash2,
  Inbox,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "NEW", label: "Mới" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "RESOLVED", label: "Đã xử lý" },
];

const STATUS_BADGES = {
  NEW: { label: "Mới", className: "bg-blue-100 text-blue-700 border-blue-200" },
  IN_PROGRESS: {
    label: "Đang xử lý",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  RESOLVED: {
    label: "Đã xử lý",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
};

export default function MessagesPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["contact-messages", statusFilter],
    queryFn: () =>
      listContactMessages(statusFilter ? { status: statusFilter } : {}),
  });

  const { data: stats } = useQuery({
    queryKey: ["contact-stats"],
    queryFn: getContactStats,
  });

  const statusMutation = useMutation({
    mutationFn: updateContactStatus,
    onSuccess: () => {
      toast.success("Cập nhật trạng thái");
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["contact-stats"] });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Cập nhật thất bại"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      toast.success("Đã xóa tin nhắn");
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["contact-stats"] });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa thất bại"),
  });

  const handleDelete = (msg) => {
    if (window.confirm(`Xóa tin nhắn từ "${msg.fullName}"?`)) {
      deleteMutation.mutate(msg.id);
    }
  };

  const items = data?.items || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tin nhắn liên hệ</h1>
        <p className="text-gray-600 text-sm mt-1">
          Quản lý tin nhắn từ form liên hệ
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Inbox}
          color="bg-gray-100 text-gray-600"
          label="Tổng"
          value={stats?.total ?? "—"}
        />
        <StatCard
          icon={Sparkles}
          color="bg-blue-100 text-blue-600"
          label="Mới"
          value={stats?.newCount ?? "—"}
          highlight={stats?.newCount > 0}
        />
        <StatCard
          icon={Clock}
          color="bg-amber-100 text-amber-600"
          label="Đang xử lý"
          value={stats?.inProgress ?? "—"}
        />
        <StatCard
          icon={CheckCircle2}
          color="bg-emerald-100 text-emerald-600"
          label="Đã xử lý"
          value={stats?.resolved ?? "—"}
        />
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <Button
            key={opt.value || "all"}
            size="sm"
            variant={statusFilter === opt.value ? "default" : "outline"}
            onClick={() => setStatusFilter(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có tin nhắn nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((msg) => {
            const badge = STATUS_BADGES[msg.status] || STATUS_BADGES.NEW;
            return (
              <Card key={msg.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {msg.fullName}
                        </h3>
                        <Badge variant="outline" className={badge.className}>
                          {badge.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                        <a
                          href={`mailto:${msg.email}`}
                          className="inline-flex items-center gap-1 hover:text-blue-600"
                        >
                          <Mail className="h-3 w-3" />
                          {msg.email}
                        </a>
                        {msg.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {msg.phone}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(msg.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(msg)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {msg.subject && (
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Chủ đề: {msg.subject}
                    </p>
                  )}

                  <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["NEW", "IN_PROGRESS", "RESOLVED"].map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={msg.status === s ? "default" : "outline"}
                        disabled={
                          msg.status === s || statusMutation.isPending
                        }
                        onClick={() =>
                          statusMutation.mutate({ id: msg.id, status: s })
                        }
                      >
                        {STATUS_BADGES[s].label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value, highlight }) {
  return (
    <Card className={highlight ? "border-blue-300 bg-blue-50/30" : ""}>
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
