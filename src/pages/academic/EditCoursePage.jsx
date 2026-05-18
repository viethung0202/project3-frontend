import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import CourseForm from "@/components/course/CourseForm";
import { useCourseDetail, useUpdateCourse } from "@/hooks/useCourses";

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetail(id);
  const { mutate: updateCourse, isPending } = useUpdateCourse();

  const handleSubmit = (formData) => {
    updateCourse(
      { id, formData },
      {
        onSuccess: () => navigate("/academic/courses"),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Sửa khóa học</h1>
        <p className="text-gray-600 mt-1">{course?.title}</p>
      </div>

      <CourseForm
        initialData={course}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </div>
  );
}
