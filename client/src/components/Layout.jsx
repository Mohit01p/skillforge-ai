import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => (
  <div className="flex min-h-screen bg-surface">
    <Sidebar />
    <main className="flex-1 min-w-0">
      <Outlet />
    </main>
  </div>
);

export default Layout;