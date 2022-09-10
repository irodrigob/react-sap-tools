import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import AppTopToolbar from "./appBar/appBar";

export default function MainLayout() {
  return (
    <div>
      <AppTopToolbar />
      <Outlet />
    </div>
  );
}
