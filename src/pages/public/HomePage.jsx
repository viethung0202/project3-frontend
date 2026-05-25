import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Globe,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Học tiếng Anh online chất lượng
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              Chinh phục tiếng Anh
              <span className="block text-blue-600">cùng EngCenter</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Khóa học chất lượng cao, đội ngũ giáo viên giàu kinh nghiệm, lộ
              trình học tập rõ ràng giúp bạn nói tiếng Anh tự tin.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild size="lg" className="text-base">
                <Link to="/courses">
                  Khám phá khóa học
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/register">Đăng ký miễn phí</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 border-y bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem
              icon={Users}
              value="5,000+"
              label="Học viên"
              color="text-blue-600"
            />
            <StatItem
              icon={BookOpen}
              value="50+"
              label="Khóa học"
              color="text-emerald-600"
            />
            <StatItem
              icon={GraduationCap}
              value="30+"
              label="Giáo viên"
              color="text-orange-600"
            />
            <StatItem
              icon={Award}
              value="95%"
              label="Hài lòng"
              color="text-purple-600"
            />
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Vì sao chọn chúng tôi?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cam kết mang đến trải nghiệm học tập hiệu quả nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureItem
              icon={Globe}
              title="Học mọi lúc mọi nơi"
              description="Truy cập bài học 24/7 trên mọi thiết bị, học theo tốc độ của bạn."
            />
            <FeatureItem
              icon={GraduationCap}
              title="Giáo viên chất lượng"
              description="Đội ngũ giáo viên có chứng chỉ quốc tế và nhiều năm kinh nghiệm."
            />
            <FeatureItem
              icon={CheckCircle2}
              title="Lộ trình rõ ràng"
              description="Từ cơ bản đến nâng cao, có quiz và flashcard giúp ghi nhớ nhanh."
            />
            <FeatureItem
              icon={Clock}
              title="Tiết kiệm thời gian"
              description="Học ngắn gọn, hiệu quả với phương pháp được thiết kế khoa học."
            />
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình?
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Đăng ký ngay hôm nay để trải nghiệm khóa học miễn phí và nhận được
            lộ trình học tập phù hợp với bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link to="/register">
                Đăng ký miễn phí
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
            >
              <Link to="/courses">Xem khóa học</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========== SUB COMPONENTS ========== */

function StatItem({ icon: Icon, value, label, color }) {
  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center mb-3 ${color}`}>
        <Icon className="h-8 w-8" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-100 text-blue-600 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
