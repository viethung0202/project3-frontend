import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listMyCertificates } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Loader2, ExternalLink, Inbox } from "lucide-react";

export default function StudentCertificatesPage() {
  const { data: certs = [], isLoading } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: listMyCertificates,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chứng chỉ của tôi</h1>
        <p className="text-gray-600 text-sm mt-1">
          Các chứng chỉ đã nhận được sau khi hoàn thành khóa học
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
      ) : certs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="h-14 w-14 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">
              Bạn chưa có chứng chỉ nào. Hãy hoàn thành 100% một khóa học để
              nhận chứng chỉ.
            </p>
            <Button asChild>
              <Link to="/student/courses">Xem khóa học</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((cert) => (
            <Card
              key={cert.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white relative">
                <Award className="absolute right-4 top-4 h-8 w-8 opacity-30" />
                <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                  Chứng chỉ
                </p>
                <p className="font-mono text-sm">{cert.certNumber}</p>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {cert.course.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline">{cert.course.level}</Badge>
                  {cert.score !== null && cert.score !== undefined && (
                    <span className="text-xs text-gray-600">
                      Điểm TB: <strong>{cert.score}%</strong>
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Cấp ngày:{" "}
                  {new Date(cert.issuedAt).toLocaleDateString("vi-VN")}
                </p>
                <Button asChild className="w-full">
                  <Link to={`/certificate/${cert.certNumber}`} target="_blank">
                    Xem chứng chỉ <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
