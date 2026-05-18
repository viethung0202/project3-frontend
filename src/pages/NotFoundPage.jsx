import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 bg-blue-100 text-blue-600 rounded-full mb-4">
          <FileQuestion className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          404 - Không tìm thấy
        </h1>
        <p className="text-gray-600 mb-6">Trang bạn tìm kiếm không tồn tại</p>
        <Button asChild>
          <Link to="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
