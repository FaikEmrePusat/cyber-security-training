import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { NowPage } from './pages/NowPage'
import { WeekPage } from './pages/WeekPage'
import { MonthPage } from './pages/MonthPage'
import { ReviewPage } from './pages/ReviewPage'
import { SettingsPage } from './pages/SettingsPage'
import { LoginPage } from './pages/LoginPage'
import { GuidePage } from './pages/GuidePage'
import { UstaProvider } from './state/UstaProvider'

export default function App() {
  return (
    <UstaProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<NowPage />} />
            <Route path="week" element={<WeekPage />} />
            <Route path="month" element={<MonthPage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="guide" element={<GuidePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UstaProvider>
  )
}
