import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import AboutPage from "@/pages/AboutPage";
import ResourcesPage from "@/pages/ResourcesPage";
import TutorialsPage from "@/pages/TutorialsPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AboutPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="*" element={<AboutPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
