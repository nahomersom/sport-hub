import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { Dashboard } from "./pages/Dashboard";
import { MatchDetail } from "./pages/MatchDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Dashboard />} />
        <Route path={ROUTES.MATCH} element={<MatchDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
