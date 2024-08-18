import { RouterProvider } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import router from "./router";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import posthog from "posthog-js";
import { getSettings } from "@/business/settings-store";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  useEffect(() => {
    if (import.meta.env.MODE === "production") {
      if (
        import.meta.env.VITE_POSTHOG_KEY &&
        import.meta.env.VITE_POSTHOG_HOST
      ) {
        posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
          api_host: import.meta.env.VITE_POSTHOG_HOST,
          autocapture: false,
        });
      }
    }
  }, []);

  const { i18n } = useTranslation();

  const initLanguage = async () => {
    getSettings("language").then((language) => {
      i18n.changeLanguage(language);
    });
  };

  useEffect(() => {
    initLanguage();
  }, []);

  return (
    <Provider store={store}>
      <PostHogProvider client={posthog}>
        <RouterProvider router={router} />
      </PostHogProvider>
    </Provider>
  );
}

export default App;
