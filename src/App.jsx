import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PublicLayout from "@/components/layout/PublicLayout";
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";

function App() {
  return (
    <div>
      {/* Toast toàn app */}
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
