import { resolveRoute } from "./lib/routing";
import { NotFound } from "./pages/NotFound";
import { ThemeChooser } from "./pages/ThemeChooser";
import { ThemePage } from "./pages/ThemePage";

export default function App() {
  const route = resolveRoute(window.location.pathname);

  if (route.kind === "chooser") return <ThemeChooser />;
  if (route.kind === "theme") return <ThemePage theme={route.theme} />;
  return <NotFound />;
}
