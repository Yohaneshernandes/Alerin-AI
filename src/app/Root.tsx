import { Outlet, useLocation } from "react-router";
import FloatingClaro from "../components/FloatingClaro";

export default function Root() {
  const { pathname } = useLocation();
  const hideFloat = pathname === "/claro" || pathname === "/";

  return (
    <>
      <Outlet />
      {!hideFloat && <FloatingClaro />}
    </>
  );
}
