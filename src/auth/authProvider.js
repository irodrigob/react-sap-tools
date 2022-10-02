import {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { GOOGLE_URL_SCRIPT } from "./constants";
import { loadGSIScript } from "./hooks/useScript";
import { STATUS } from "./constants";
import useGoogle from "./hooks/useGoogle";

const AuthContext = createContext();

export const AuthProvider = ({ client_id, children }) => {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState(null);
  const [scriptLoadSuccess, setScriptLoadSuccess] = useState(false);
  const [scriptLoadError, setScriptLoadError] = useState(false);

  //const { promptLogin } = useGoogle(client_id);
  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    loadGSIScript(
      () => {
        setScriptLoadSuccess(true);
      },
      () => {
        setScriptLoadError(true);
      }
    );

    return () => {
      const scriptTag = document.querySelector(
        `script[src="${GOOGLE_URL_SCRIPT}"]`
      );
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, []);

  const clientId = useMemo(() => {
    return client_id;
  }, [client_id]);

  /*************************************
   * Funciones
   ************************************/

  /**
   * Captura cuando se hace login y guarda las credenciales y actualiza
   * el estado
   * @param {object} credentials | Credenciales de la autentificación
   */
  const loginSuccess = (credentials) => {
    setStatus(STATUS.AUTH);
    setSession(credentials);
    //console.log(credentials);
  };

  /**
   * Captura cuando se produce un error al loguearse.
   * @param {object} error | Objeto de error
   */
  const loginError = (error = null) => {
    setStatus(STATUS.NO_AUTH);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        clientId,
        status,
        setStatus,
        session,
        setSession,
        scriptLoadSuccess,
        scriptLoadError,
        loginSuccess,
        loginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => useContext(AuthContext);
