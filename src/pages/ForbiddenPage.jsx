import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 bg-red-100 text-red-600 rounded-full mb-4">
          <ShieldX className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          403 - Cấm truy cập
        </h1>
        <p className="text-gray-600 mb-6">
          Bạn không có quyền truy cập trang này
        </p>
        <Button asChild>
          <Link to="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
