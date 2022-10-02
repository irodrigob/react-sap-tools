import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import MainLayout from "./components/layout/mainLayout";
import TransportOrder from "components/transportOrder/transportOrder";
import { AuthGuard } from "./auth/authGuard";
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <AuthGuard>
              <Main />
            </AuthGuard>
          }
        />
        <Route
          path="/transportOrder"
          element={
            <AuthGuard>
              <TransportOrder />
            </AuthGuard>
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
