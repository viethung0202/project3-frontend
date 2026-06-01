import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Target,
  Eye,
  Heart,
  Users,
  Award,
  BookOpen,
  Globe,
  Lightbulb,
  Handshake,
  ArrowRight,
  Sparkles,
  Quote,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Về EngCenter
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Đưa tiếng Anh đến gần hơn
              <span className="block text-blue-600">với mọi người Việt</span>
            </h1>
            <p className="text-lg text-gray-600">
              EngCenter là nền tảng học tiếng Anh online được thiết kế để bạn có
              thể học mọi lúc, mọi nơi — với lộ trình rõ ràng, công cụ hỗ trợ
              hiện đại và đội ngũ giáo viên tận tâm.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <PillarCard
              icon={Target}
              accent="bg-blue-100 text-blue-600"
              title="Sứ mệnh"
              text="Mang đến cho học viên Việt Nam môi trường học tiếng Anh chất lượng cao, dễ tiếp cận và phù hợp với mọi trình độ — từ người mới bắt đầu đến người luyện thi IELTS, TOEIC."
            />
            <PillarCard
              icon={Eye}
              accent="bg-emerald-100 text-emerald-600"
              title="Tầm nhìn"
              text="Trở thành nền tảng học tiếng Anh online được tin dùng nhất Việt Nam, nơi mỗi học viên đều có thể tự tin giao tiếp và mở ra cơ hội học tập, làm việc toàn cầu."
            />
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Câu chuyện của chúng tôi
              </h2>
              <p className="text-gray-600">
                Hành trình xây dựng nền tảng học tiếng Anh hiệu quả
              </p>
            </div>
            <div className="space-y-5">
              <TimelineItem
                year="2023"
                title="Khởi đầu"
                text="EngCenter ra đời với mong muốn giúp người Việt vượt qua rào cản ngôn ngữ. Nền tảng đầu tiên ra mắt với 5 khóa học cơ bản."
              />
              <TimelineItem
                year="2024"
                title="Mở rộng"
                text="Đội ngũ giáo viên mở rộng lên hơn 30 người. Bổ sung công cụ flashcard và quiz tương tác, giúp việc ghi nhớ và kiểm tra trở nên thú vị hơn."
              />
              <TimelineItem
                year="2025"
                title="Đột phá"
                text="Đạt 5.000 học viên đang theo học. Hoàn thiện hệ thống quản lý học tập với phân quyền chi tiết cho học viên, giáo viên và bộ phận quản lý."
              />
              <TimelineItem
                year="2026"
                title="Hôm nay"
                text="Tiếp tục phát triển nội dung và công nghệ, đem trải nghiệm học tập tốt hơn đến từng học viên."
                last
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Giá trị cốt lõi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những điều chúng tôi luôn giữ vững trong từng bài học
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <ValueCard
              icon={Heart}
              color="text-rose-600 bg-rose-100"
              title="Tận tâm"
              text="Mỗi học viên là một câu chuyện riêng. Chúng tôi lắng nghe và đồng hành với từng bước tiến."
            />
            <ValueCard
              icon={Lightbulb}
              color="text-amber-600 bg-amber-100"
              title="Đổi mới"
              text="Liên tục cải tiến nội dung và phương pháp giảng dạy theo xu hướng giáo dục toàn cầu."
            />
            <ValueCard
              icon={Handshake}
              color="text-blue-600 bg-blue-100"
              title="Trung thực"
              text="Cam kết minh bạch về chất lượng khóa học, học phí và kết quả mong đợi cho học viên."
            />
            <ValueCard
              icon={Award}
              color="text-purple-600 bg-purple-100"
              title="Chất lượng"
              text="Mọi khóa học đều được biên soạn kỹ lưỡng, giáo viên có chứng chỉ và kinh nghiệm thực tế."
            />
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              EngCenter trong những con số
            </h2>
            <p className="text-blue-100">
              Niềm tin của hàng nghìn học viên là động lực của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <NumberStat icon={Users} value="5,000+" label="Học viên" />
            <NumberStat icon={BookOpen} value="50+" label="Khóa học" />
            <NumberStat icon={GraduationCap} value="30+" label="Giáo viên" />
            <NumberStat icon={Globe} value="64" label="Tỉnh thành" />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-10 w-10 text-blue-200 mx-auto mb-4" />
            <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed">
              “Sau 6 tháng học tại EngCenter, tôi đã tự tin giao tiếp với khách
              hàng nước ngoài. Lộ trình rõ ràng, giáo viên thân thiện — đúng
              điều tôi cần.”
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                MH
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Minh Hằng</p>
                <p className="text-sm text-gray-500">Học viên khóa Giao tiếp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Bắt đầu hành trình của bạn ngay hôm nay
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Đăng ký miễn phí để khám phá các khóa học phù hợp với mục tiêu của
            bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/register">
                Đăng ký miễn phí <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/courses">Xem khóa học</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========== SUB COMPONENTS ========== */

function PillarCard({ icon: Icon, accent, title, text }) {
  return (
    <div className="p-7 rounded-2xl border bg-white hover:shadow-md transition-shadow">
      <div
        className={`inline-flex items-center justify-center h-12 w-12 rounded-xl mb-4 ${accent}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}

function TimelineItem({ year, title, text, last = false }) {
  return (
    <div className="relative flex gap-4">
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
          {year}
        </div>
        {!last && <div className="w-px flex-1 bg-blue-200 mt-1" />}
      </div>
      {/* Content */}
      <div className="pb-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function ValueCard({ icon: Icon, color, title, text }) {
  return (
    <div className="p-6 rounded-xl border bg-white hover:shadow-md transition-shadow">
      <div
        className={`inline-flex items-center justify-center h-12 w-12 rounded-xl mb-3 ${color}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}

function NumberStat({ icon: Icon, value, label }) {
  return (
    <div className="text-center text-white">
      <Icon className="h-8 w-8 mx-auto mb-2 opacity-90" />
      <div className="text-3xl md:text-4xl font-bold mb-0.5">{value}</div>
      <div className="text-sm text-blue-100">{label}</div>
    </div>
  );
}
