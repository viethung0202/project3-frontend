import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { submitContact } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Video,
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: (res) => {
      toast.success(
        res?.message || "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong 24 giờ.",
      );
      setForm({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Gửi tin nhắn thất bại, thử lại nhé",
      );
    },
  });
  const submitting = mutation.isPending;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.message) {
      toast.error("Vui lòng điền họ tên, email và nội dung");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Liên hệ với EngCenter
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Chúng tôi luôn{" "}
              <span className="text-blue-600">sẵn sàng hỗ trợ</span>
            </h1>
            <p className="text-lg text-gray-600">
              Bạn có câu hỏi về khóa học, học phí hay lộ trình học? Hãy để lại
              tin nhắn, đội ngũ tư vấn sẽ phản hồi trong vòng 24 giờ.
            </p>
          </div>
        </div>
      </section>

      {/* INFO + FORM */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* INFO */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thông tin liên hệ
                </h2>
                <p className="text-gray-600 text-sm">
                  Liên hệ trực tiếp qua các kênh dưới đây
                </p>
              </div>

              <InfoItem
                icon={MapPin}
                color="bg-blue-100 text-blue-600"
                title="Địa chỉ"
                lines={[
                  "Tầng 5, Tòa nhà Education Tower",
                  "123 Xuân Thủy, Cầu Giấy, Hà Nội",
                ]}
              />
              <InfoItem
                icon={Phone}
                color="bg-emerald-100 text-emerald-600"
                title="Hotline"
                lines={["1900 1234 (8h00 - 21h00)", "0901 234 567"]}
              />
              <InfoItem
                icon={Mail}
                color="bg-amber-100 text-amber-600"
                title="Email"
                lines={["hung9aytt01@gmail.com"]}
              />
              <InfoItem
                icon={Clock}
                color="bg-purple-100 text-purple-600"
                title="Giờ làm việc"
                lines={[
                  "Thứ 2 - Thứ 7: 08:00 - 21:00",
                  "Chủ nhật: 09:00 - 17:00",
                ]}
              />

              {/* SOCIAL */}
              <div className="pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Theo dõi chúng tôi
                </p>
                <div className="flex gap-2">
                  <SocialButton
                    icon={Globe}
                    color="bg-blue-600 hover:bg-blue-700"
                    href="https://facebook.com"
                    label="Facebook"
                  />
                  <SocialButton
                    icon={Video}
                    color="bg-red-600 hover:bg-red-700"
                    href="https://youtube.com"
                    label="Youtube"
                  />
                  <SocialButton
                    icon={MessageCircle}
                    color="bg-emerald-600 hover:bg-emerald-700"
                    href="https://zalo.me"
                    label="Zalo"
                  />
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="lg:col-span-3">
              <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Điền vào form bên dưới và chúng tôi sẽ phản hồi sớm nhất
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">
                        Họ và tên <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Nguyễn Văn A"
                        value={form.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="09xxxxxxxx"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject">Chủ đề</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="VD: Tư vấn khóa TOEIC"
                        value={form.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">
                      Nội dung <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Bạn cần hỗ trợ điều gì?"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Gửi tin nhắn
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="py-14 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Tìm chúng tôi trên bản đồ
              </h2>
              <p className="text-gray-600">
                Ghé thăm văn phòng để được tư vấn trực tiếp
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border shadow-sm bg-white">
              <iframe
                title="EngCenter location"
                src="https://www.google.com/maps?q=Xuan+Thuy+Cau+Giay+Ha+Noi&output=embed"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ngắn */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Câu hỏi thường gặp
              </h2>
              <p className="text-gray-600">
                Có thể câu trả lời bạn cần đã ở đây
              </p>
            </div>
            <div className="space-y-3">
              <FaqItem
                q="Tôi có thể học thử miễn phí không?"
                a="Có. Bạn chỉ cần đăng ký tài khoản và đăng ký các khóa học miễn phí để bắt đầu học ngay."
              />
              <FaqItem
                q="Làm sao để biết khóa học nào phù hợp với mình?"
                a="Vui lòng để lại thông tin qua form bên trên, đội ngũ tư vấn sẽ liên hệ và đánh giá trình độ giúp bạn."
              />
              <FaqItem
                q="Học phí thanh toán như thế nào?"
                a="Hiện tại chúng tôi hỗ trợ thanh toán qua chuyển khoản ngân hàng và ví điện tử (MoMo, ZaloPay)."
              />
              <FaqItem
                q="Tôi có được cấp chứng chỉ sau khi hoàn thành?"
                a="Có. Mỗi khóa học có chứng chỉ hoàn thành nếu bạn đạt điểm tối thiểu trong các bài kiểm tra."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========== SUB COMPONENTS ========== */

function InfoItem({ icon: Icon, color, title, lines }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl border bg-white hover:shadow-sm transition-shadow">
      <div
        className={`flex-shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-lg ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        {lines.map((line, idx) => (
          <p key={idx} className="text-sm text-gray-600 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function SocialButton({ icon: Icon, color, href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center justify-center h-10 w-10 rounded-lg text-white transition-colors ${color}`}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

function FaqItem({ q, a }) {
  return (
    <details className="group border rounded-xl bg-white">
      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between font-medium text-gray-900">
        <span>{q}</span>
        <span className="ml-2 text-blue-600 group-open:rotate-45 transition-transform text-xl leading-none">
          +
        </span>
      </summary>
      <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</div>
    </details>
  );
}
