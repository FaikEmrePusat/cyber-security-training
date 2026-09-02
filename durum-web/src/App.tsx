import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { AlmanyaPage } from "./pages/Almanya";
import { BecerilerPage } from "./pages/Beceriler";
import { BugunPage } from "./pages/Bugun";
import { DurumPage } from "./pages/Durum";
import { FormullerPage } from "./pages/Formuller";
import { HizPage } from "./pages/Hiz";
import { KapilarPage } from "./pages/Kapilar";
import { DataPage } from "./pages/Data";
import { RecordPage } from "./pages/Record";
import { HaritaPage } from "./pages/Harita";
import { TekrarPage } from "./pages/Tekrar";
import { DurumProvider } from "./store";

export default function App() {
  return (
    <DurumProvider>
      <HashRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<BugunPage />} />
          <Route path="/durum" element={<DurumPage />} />
          <Route path="/beceriler" element={<BecerilerPage />} />
          <Route path="/kapilar" element={<KapilarPage />} />
          <Route path="/almanya" element={<AlmanyaPage />} />
          <Route path="/hiz" element={<HizPage />} />
          <Route path="/harita" element={<HaritaPage />} />
          <Route path="/tekrar" element={<TekrarPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/log" element={<Navigate to="/record" replace />} />
          <Route path="/formuller" element={<FormullerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </DurumProvider>
  );
}
