import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <nav className="bg-discord-dark py-4 px-6 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg 
            className="w-7 h-7 text-indigo-500" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z"/>
          </svg>
          <Link href="/">
            <span className="font-bold text-xl cursor-pointer">Discord Wrapped</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <span className={`hover:text-indigo-400 transition ${location === "/" ? "text-indigo-400" : ""}`}>
              Home
            </span>
          </Link>
          <Link href="/about">
            <span className={`hover:text-indigo-400 transition ${location === "/about" ? "text-indigo-400" : ""}`}>
              About
            </span>
          </Link>
          <Link href="/faq">
            <span className={`hover:text-indigo-400 transition ${location === "/faq" ? "text-indigo-400" : ""}`}>
              FAQ
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <Button
              onClick={login}
              className="hidden md:flex bg-indigo-600 hover:bg-indigo-700"
            >
              Connect Discord
            </Button>
          ) : (
            <Link href={`/dashboard?id=${user?.id}`}>
              <Button className="hidden md:flex bg-indigo-600 hover:bg-indigo-700">
                Dashboard
              </Button>
            </Link>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center">
                    {user.discordAvatar ? (
                      <img 
                        src={user.discordAvatar} 
                        alt="User avatar" 
                        className="h-10 w-10 rounded-full border-2 border-indigo-500"
                      />
                    ) : (
                      <span className="font-medium text-white">{(user.discordUsername || user.username).charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-discord-dark"></div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-discord-dark border-discord-darker">
                <DropdownMenuLabel className="text-gray-400">
                  {user.discordUsername || user.username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="focus:bg-indigo-600 focus:text-white">
                  <Link href={`/dashboard?id=${user.id}`} className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-indigo-600 focus:text-white">
                  <Link href="/about" className="w-full">
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-indigo-600 focus:text-white">
                  <Link href="/faq" className="w-full">
                    FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="focus:bg-red-600 focus:text-white text-red-400"
                  onClick={logout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-3 px-4 space-y-2 border-t border-gray-700 mt-4">
          <Link href="/">
            <div className={`px-3 py-2 rounded ${location === "/" ? "bg-indigo-600" : "hover:bg-discord-darker"}`}>
              Home
            </div>
          </Link>
          <Link href="/about">
            <div className={`px-3 py-2 rounded ${location === "/about" ? "bg-indigo-600" : "hover:bg-discord-darker"}`}>
              About
            </div>
          </Link>
          <Link href="/faq">
            <div className={`px-3 py-2 rounded ${location === "/faq" ? "bg-indigo-600" : "hover:bg-discord-darker"}`}>
              FAQ
            </div>
          </Link>
          <Button
            onClick={login}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Connect Discord
          </Button>
        </div>
      )}
    </nav>
  );
}
