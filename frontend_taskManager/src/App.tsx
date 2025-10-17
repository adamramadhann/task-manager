import { Route, Routes, Navigate } from 'react-router-dom'
import { HomePage } from './components/dashboard/Home'
import DashboardLayout from './layout'
import { ProgressTeamPage } from './components/dashboard/ProgresTeamPage'
import { TaskLogPage } from './components/dashboard/TaskLogPage'
import LoginPage from './components/auth/LoginPage'
import { useEffect, useState } from 'react'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('authToken')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('username')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout onLogout={handleLogout} />}>
        <Route index element={<HomePage />} />
        <Route path="progress" element={<ProgressTeamPage />} />
        <Route path="task-log" element={<TaskLogPage />} />
      </Route>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App