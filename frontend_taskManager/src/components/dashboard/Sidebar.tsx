import { Home, List, LogOut, Settings, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

type LogouthProps = {
  onLogout?: () => void
}

const Sidebar = ({ onLogout } : LogouthProps ) => {
  const location = useLocation()

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'progress', label: 'Progress Team', icon: User, path: '/progress' },
    { id: 'taskLog', label: 'Task Log', icon: List, path: '/task-log' },
  ]

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div
      className={`w-56 bg-gradient-to-b h-screen from-indigo-600 to-purple-600 text-white transition-all duration-300 flex flex-col shadow-xl`}
    >
      <div className="p-6 border-b border-indigo-500"> 
        <h2 className="text-2xl font-bold">Task Tracker</h2>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.path
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'hover:bg-indigo-500 text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" /> 
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-indigo-500 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-500 transition-all text-white">
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Settings</span>
        </button>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-500 transition-all text-white"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar