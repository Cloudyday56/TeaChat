import React from 'react'
import {Link, useNavigate} from 'react-router-dom'; // For navigation links
import {MessageSquare, Settings, User, LogOut} from 'lucide-react'; // Icons for the navbar
import {useAuthStore} from '../store/useAuthStore'; // Zustand store for authentication

const Navbar = () => {
  const {logout, authUser} = useAuthStore(); // Zustand store for authentication
  const navigate = useNavigate(); // For navigation

  // Handle logout with navigation
  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          {/* App title (left) */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">TeaChat</h1>
            </Link>
          </div>

          {/* Navigation links (right) */}
          <div className="flex items-center gap-2">
            {/* Settings */}
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            
            {/* Profile and Logout */}
            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={handleLogout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;