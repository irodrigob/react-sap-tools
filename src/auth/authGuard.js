import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "./authProvider";
import { STATUS } from "./constants";
import useGoogle from "./hooks/useGoogle";
import VerifyLogin from "./components/verifyLogin";

/**
 * Verifica a nivel de página/Componente si tiene autorización. En caso
 * contrario va a la pantalla de login
 * @param {object} | Componente hijo
 * @returns | Componente de verificación login, navegación al login
 * o componente pasado por parámetro
 */
export const AuthGuard = ({ children }) => {
  const { status } = useSession();
  let location = useLocation();
  const {} = useGoogle();

  if (status === STATUS.LOADING) return <VerifyLogin />;
  else if (status == STATUS.NO_AUTH)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};
