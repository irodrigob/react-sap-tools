import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "graphql/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@ui5/webcomponents-react";
import { ThemeProvider as ThemeProviderMaterial } from "@mui/material/styles";
import { GlobalProvider } from "context/globalDataContext";
import { SAPProvider } from "context/sapDataContext";
import { AuthProvider } from "./auth/authProvider";
import { I18nProvider } from "./translations/i18nContext";
import store from "./reduxStore/store";
import App from "./App";
import "./translations/i18n";
import theme from "./theme";

// Librerias para que junto al tema puesto en el index.html funcione el dark mode
import "@ui5/webcomponents-theming/dist/Assets.js";
import "@ui5/webcomponents/dist/generated/json-imports/Themes";
import "@ui5/webcomponents-fiori/dist/generated/json-imports/Themes";

const apolloClient = createApolloClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <I18nProvider>
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <AuthProvider client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GlobalProvider>
              <SAPProvider>
                <BrowserRouter>
                  <ThemeProviderMaterial theme={theme}>
                    <ThemeProvider>
                      <App />
                      <ToastContainer />
                    </ThemeProvider>
                  </ThemeProviderMaterial>
                </BrowserRouter>
              </SAPProvider>
            </GlobalProvider>
          </AuthProvider>
        </ApolloProvider>
      </Provider>
    </I18nProvider>
  </React.StrictMode>
);
