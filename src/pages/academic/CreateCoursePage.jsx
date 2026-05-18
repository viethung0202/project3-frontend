import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CourseForm from "@/components/course/CourseForm";
import { useCreateCourse } from "@/hooks/useCourses";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { mutate: createCourse, isPending } = useCreateCourse();

  const handleSubmit = (formData) => {
    createCourse(formData, {
      onSuccess: () => {
        navigate("/academic/courses");
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          to="/academic/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại danh sách
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tạo khóa học mới</h1>
        <p className="text-gray-600 mt-1">
          Điền thông tin để tạo khóa học. Sau khi tạo, bạn có thể thêm modules.
        </p>
      </div>

      <CourseForm onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
