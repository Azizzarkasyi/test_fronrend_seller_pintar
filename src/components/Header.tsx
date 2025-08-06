import {User, LogOut} from "lucide-react";

interface User {
  username: string;
  role: "User" | "Admin";
}

interface HeaderProps {
  user: User | null;
  showLogout: boolean;
  onToggleLogout: () => void;
  onLogout: () => void;
}

export default function Header({
  user,
  showLogout,
  onToggleLogout,
  onLogout,
}: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-12 md:mb-16">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-sm font-bold">◉</span>
        </div>
        <span className="text-lg font-medium">Logipsum</span>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4" data-user-menu>
        <button
          onClick={onToggleLogout}
          className="flex items-center space-x-1 sm:space-x-2 bg-white/10 hover:bg-white/20 px-2 py-2 sm:px-4 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
        >
          <User className="w-4 h-4 opacity-90" />
          <span className="text-xs sm:text-sm opacity-90">
            {user?.username}
          </span>
        </button>

        {showLogout && (
          <button
            onClick={onLogout}
            className="bg-red-500/90 hover:bg-red-600 px-2 py-2 sm:px-4 rounded-lg transition-colors backdrop-blur-sm border border-red-400/50 flex items-center space-x-1 sm:space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}
