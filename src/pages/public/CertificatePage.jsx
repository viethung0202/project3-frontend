import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCertificateByNumber } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Printer,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Share2,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CertificatePage() {
  const { certNumber } = useParams();

  const { data: cert, isLoading, error } = useQuery({
    queryKey: ["certificate", certNumber],
    queryFn: () => getCertificateByNumber(certNumber),
    retry: false,
  });

  const handlePrint = () => window.print();
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã copy link chứng chỉ");
    } catch {
      toast.error("Không copy được link");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <ShieldAlert className="h-14 w-14 text-red-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Không tìm thấy chứng chỉ
        </h1>
        <p className="text-gray-600 mb-4">
          Mã chứng chỉ <strong>{certNumber}</strong> không tồn tại hoặc đã bị
          thu hồi.
        </p>
        <Button asChild>
          <Link to="/">Về trang chủ</Link>
        </Button>
      </div>
    );
  }

  const isRevoked = cert.status === "REVOKED";
  const issued = new Date(cert.issuedAt);
  const dateStr = issued.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:p-0">
      {/* Toolbar (ẩn khi print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-1" /> Về trang chủ
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Copy link
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> In / Lưu PDF
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative bg-white aspect-[1.414/1] shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none ${
            isRevoked ? "opacity-60" : ""
          }`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #dbeafe 0%, transparent 40%), radial-gradient(circle at 80% 80%, #e0e7ff 0%, transparent 40%)",
          }}
        >
          {/* Border */}
          <div className="absolute inset-3 border-[3px] border-double border-blue-600/40 rounded-md pointer-events-none" />
          <div className="absolute inset-5 border border-blue-400/30 rounded-sm pointer-events-none" />

          {/* Corner ornaments */}
          <Corner className="top-6 left-6" />
          <Corner className="top-6 right-6 rotate-90" />
          <Corner className="bottom-6 right-6 rotate-180" />
          <Corner className="bottom-6 left-6 -rotate-90" />

          {/* Watermark REVOKED */}
          {isRevoked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-red-500/30 text-7xl font-black -rotate-12 border-8 border-red-500/30 px-8 py-2 rounded-lg">
                REVOKED
              </div>
            </div>
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-between px-12 py-10 text-center">
            {/* Header */}
            <div>
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white mb-3">
                <Award className="h-9 w-9" />
              </div>
              <p className="text-xs text-gray-500 tracking-[0.3em] uppercase">
                EngCenter — Trung tâm Anh ngữ
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
                CHỨNG CHỈ HOÀN THÀNH
              </h1>
              <p className="text-sm text-gray-500 mt-1 italic">
                Certificate of Completion
              </p>
            </div>

            {/* Body */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Trân trọng chứng nhận học viên
              </p>
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-serif">
                {cert.user.fullName}
              </p>
              <p className="text-sm text-gray-600 max-w-xl">
                đã hoàn thành xuất sắc khóa học
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                "{cert.course.title}"
              </p>
              <p className="text-xs text-gray-500">
                Trình độ:{" "}
                <span className="font-semibold uppercase">
                  {cert.course.level}
                </span>
                {cert.score !== null && cert.score !== undefined && (
                  <>
                    {" · "}Điểm trung bình:{" "}
                    <span className="font-semibold">{cert.score}%</span>
                  </>
                )}
              </p>
            </div>

            {/* Footer */}
            <div className="w-full flex items-end justify-between text-xs text-gray-700">
              <div className="text-left">
                <p className="text-gray-500">Ngày cấp</p>
                <p className="font-bold text-base mt-1 border-b border-gray-300 pb-1 inline-block min-w-[120px]">
                  {dateStr}
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border-2 border-blue-600/40 mb-1">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-gray-500 text-[10px]">Mã chứng chỉ</p>
                <p className="font-mono font-bold text-sm">
                  {cert.certNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Giám đốc</p>
                <p className="font-bold text-base mt-1 border-b border-gray-300 pb-1 inline-block min-w-[120px] font-serif italic">
                  ABC
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verify hint (ẩn khi print) */}
        <div className="mt-6 text-center text-sm text-gray-600 print:hidden">
          Xác minh chứng chỉ tại:{" "}
          <span className="font-mono text-blue-700">
            {window.location.origin}/verify/{cert.certNumber}
          </span>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function Corner({ className }) {
  return (
    <svg
      className={`absolute h-10 w-10 text-blue-600/40 ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 12 L2 2 L12 2" />
      <path d="M6 16 L6 6 L16 6" />
    </svg>
  );
}
