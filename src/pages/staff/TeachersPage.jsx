import StaffUsersPage from "./StaffUsersPage";

export default function TeachersPage() {
  return (
    <StaffUsersPage
      role="TEACHER"
      title="Giáo viên"
      description="Quản lý hồ sơ giáo viên của trung tâm"
      addLabel="Thêm giáo viên"
      emptyLabel="Chưa có giáo viên nào"
    />
  );
}
