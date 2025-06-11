import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Brain, Bell, User, Settings, LogOut } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : user?.firstName 
    ? user.firstName[0] 
    : user?.email
    ? user.email[0].toUpperCase()
    : "U";

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-[var(--mindtune-neutral-200)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-[var(--mindtune-neutral-800)]">MindTune</h1>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className={`cursor-pointer transition-colors ${
                isActive('/') 
                  ? 'text-[var(--mindtune-primary)] font-medium' 
                  : 'text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)]'
              }`}>
                Dashboard
              </span>
            </Link>
            <Link href="/mood-check">
              <span className={`cursor-pointer transition-colors ${
                isActive('/mood-check') 
                  ? 'text-[var(--mindtune-primary)] font-medium' 
                  : 'text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)]'
              }`}>
                Check-in
              </span>
            </Link>
            <Link href="/history">
              <span className={`cursor-pointer transition-colors ${
                isActive('/history') 
                  ? 'text-[var(--mindtune-primary)] font-medium' 
                  : 'text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)]'
              }`}>
                History
              </span>
            </Link>
            <Link href="/support">
              <span className={`cursor-pointer transition-colors ${
                isActive('/support') 
                  ? 'text-[var(--mindtune-primary)] font-medium' 
                  : 'text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)]'
              }`}>
                Support
              </span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-[var(--mindtune-neutral-600)]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--mindtune-accent)] rounded-full"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)] text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
