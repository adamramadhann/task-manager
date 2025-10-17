import { Outlet } from 'react-router-dom'
import Sidebar from './components/dashboard/Sidebar'
import Header from './components/dashboard/Header'

type DashboardLayoutProps = {
  onLogout?: () => void
}

const DashboardLayout =({ onLogout }: DashboardLayoutProps) => {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar onLogout={onLogout} />
        <main className="flex-1 relative overflow-y-auto">
          <Header />
          <div className="px-10 pt-5">
            <Outlet  />
          </div>
        </main>
      </div>
    )
  }
  
export default DashboardLayout
