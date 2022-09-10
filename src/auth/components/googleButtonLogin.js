import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useSession } from "../authProvider";

/**
 * Botón de login estándar de google
 * @param {object} pButtonRef | Referencia a la etiquete donde se pintar el bottón
 */
export function GoogleButtonLogin(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clientId, scriptLoadSuccess, checkVerifiedLogged, loginSuccess } =
    useSession();
  const buttonRef = useRef(null);
  const from = location.state?.from?.pathname || "/";

  const handlerLogin = useCallback((response) => {
    loginSuccess(jwtDecode(response.credential));

    // De momento vamos al ráiz de la página
    navigate("/", { replace: true });
  }, []);

  /**
   * El auto_select a true es para que se autologuea con la última cuenta utilizada.
   * Esto se hace para cuando alguiente tiene más de una cuenta en chrome no tenga que
   * seleccionar la cuenta una y otra vez.
   */
  useEffect(() => {
    if (scriptLoadSuccess) {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: handlerLogin,
        auto_select: true,
        useOneTap: true,
      });

      window.google?.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
      });
    }
  }, [scriptLoadSuccess]);

  if (!scriptLoadSuccess) return <p>Cargando el botón</p>;
  return <div ref={buttonRef} />;
}
