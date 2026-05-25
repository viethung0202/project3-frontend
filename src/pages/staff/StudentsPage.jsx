import StaffUsersPage from "./StaffUsersPage";

export default function StudentsPage() {
  return (
    <StaffUsersPage
      role="STUDENT"
      title="Học sinh"
      description="Quản lý hồ sơ học sinh của trung tâm"
      addLabel="Thêm học sinh"
      emptyLabel="Chưa có học sinh nào"
    />
  );
}
