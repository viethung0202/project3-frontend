import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { verifyCertificate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function VerifyCertificatePage() {
  const { certNumber: certFromUrl } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(certFromUrl || "");

  const { data, isLoading } = useQuery({
    queryKey: ["verifyCert", certFromUrl],
    queryFn: () => verifyCertificate(certFromUrl),
    enabled: !!certFromUrl,
    retry: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/verify/${input.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Xác minh chứng chỉ
          </h1>
          <p className="text-gray-600 mt-2">
            Nhập mã chứng chỉ EngCenter để kiểm tra tính xác thực
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <Input
                placeholder="VD: ENG-2026-A3F5K9"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="font-mono uppercase"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-1" />
                Kiểm tra
              </Button>
            </form>

            {certFromUrl && isLoading && (
              <div className="text-center py-8">
                <Loader2 className="h-7 w-7 animate-spin text-blue-600 mx-auto" />
                <p className="text-sm text-gray-500 mt-2">Đang kiểm tra...</p>
              </div>
            )}

            {certFromUrl && !isLoading && data && (
              <ResultCard data={data} certNumber={certFromUrl} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResultCard({ data, certNumber }) {
  if (!data.valid) {
    return (
      <div className="text-center py-6">
        <ShieldAlert className="h-14 w-14 text-red-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-red-600 mb-1">
          {data.status === "REVOKED"
            ? "Chứng chỉ đã bị thu hồi"
            : "Không tìm thấy chứng chỉ"}
        </h2>
        <p className="text-gray-600 text-sm">
          Mã <span className="font-mono font-bold">{certNumber}</span>{" "}
          {data.status === "REVOKED"
            ? "đã bị thu hồi và không còn hiệu lực."
            : "không tồn tại trong hệ thống EngCenter."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center py-2">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 mb-2">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-emerald-700">
          Chứng chỉ hợp lệ
        </h2>
        <p className="text-gray-600 text-sm">
          Đã được cấp bởi EngCenter
        </p>
      </div>

      <div className="border rounded-lg divide-y">
        <Row label="Mã chứng chỉ" value={data.certNumber} mono />
        <Row label="Học viên" value={data.studentName} bold />
        <Row label="Khóa học" value={data.courseTitle} bold />
        <Row
          label="Trình độ"
          value={<Badge variant="outline">{data.courseLevel}</Badge>}
        />
        {data.score !== null && data.score !== undefined && (
          <Row label="Điểm trung bình" value={`${data.score}%`} bold />
        )}
        <Row
          label="Ngày cấp"
          value={new Date(data.issuedAt).toLocaleDateString("vi-VN")}
        />
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link to={`/certificate/${data.certNumber}`}>
          Xem chứng chỉ <ExternalLink className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
}

function Row({ label, value, mono, bold }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className={`${mono ? "font-mono" : ""} ${bold ? "font-semibold" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
