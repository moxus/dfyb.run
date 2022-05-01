import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import * as Pages from './pages'
import Header from './Header'
import Footer from './Footer'

const MainLayout: React.FC = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
)

const App: React.FC = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Pages.Home />} />
      <Route path="faq" element={<Pages.FAQ />} />
      <Route path="privacy" element={<Pages.Privacy />} />
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </Route>
  </Routes>
)

export default App
