import { useEffect } from "react";
import { resolveRoute } from "./lib/routing";
import { NotFound } from "./pages/NotFound";
import { ThemePage } from "./pages/ThemePage";

export default function App() {
  const route = resolveRoute(window.location.pathname);

  useEffect(() => {
    function scrollToHash() {
      if (!window.location.hash) return;
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" });
    }

    const timeoutId = window.setTimeout(scrollToHash, 60);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  if (route.kind === "theme") return <ThemePage theme={route.theme} />;
  return <NotFound />;
}
