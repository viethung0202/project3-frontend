import { Link } from "react-router-dom";
import { GraduationCap, Globe, Camera, PlayCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo + tên */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-gray-900">EngCenter</span>
          </Link>

          {/* Links nhanh */}
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link to="/courses" className="hover:text-blue-600">
              Khóa học
            </Link>
            <Link to="/about" className="hover:text-blue-600">
              Giới thiệu
            </Link>
            <Link to="/contact" className="hover:text-blue-600">
              Liên hệ
            </Link>
          </nav>

          {/* Social */}
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-500 hover:text-blue-600"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-500 hover:text-pink-600"
            >
              <Camera className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Youtube"
              className="text-gray-500 hover:text-red-600"
            >
              <PlayCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="border-t mt-6 pt-4 text-center text-sm text-gray-500">
          © {currentYear} EngCenter. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
