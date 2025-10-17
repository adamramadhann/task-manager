import { Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white w-full shadow-md px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4"> 
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button onClick={() => alert("maaf fitur ini belum siap")} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Bell className="w-6 h-6 text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">Admin User</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </div>
  </header>
  )
}

export default Header