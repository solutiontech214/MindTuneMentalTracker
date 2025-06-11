import { Link, useLocation } from "wouter";
import { Home, Heart, TrendingUp, Users } from "lucide-react";

export default function BottomNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[var(--mindtune-neutral-200)] px-4 py-2">
      <div className="flex justify-around items-center">
        <Link href="/">
          <div className={`flex flex-col items-center space-y-1 py-2 px-3 cursor-pointer ${
            isActive('/') 
              ? 'text-[var(--mindtune-primary)]' 
              : 'text-[var(--mindtune-neutral-400)]'
          }`}>
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </div>
        </Link>
        
        <Link href="/mood-check">
          <div className={`flex flex-col items-center space-y-1 py-2 px-3 cursor-pointer ${
            isActive('/mood-check') 
              ? 'text-[var(--mindtune-primary)]' 
              : 'text-[var(--mindtune-neutral-400)]'
          }`}>
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium">Check-in</span>
          </div>
        </Link>
        
        <Link href="/history">
          <div className={`flex flex-col items-center space-y-1 py-2 px-3 cursor-pointer ${
            isActive('/history') 
              ? 'text-[var(--mindtune-primary)]' 
              : 'text-[var(--mindtune-neutral-400)]'
          }`}>
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Insights</span>
          </div>
        </Link>
        
        <Link href="/support">
          <div className={`flex flex-col items-center space-y-1 py-2 px-3 cursor-pointer ${
            isActive('/support') 
              ? 'text-[var(--mindtune-primary)]' 
              : 'text-[var(--mindtune-neutral-400)]'
          }`}>
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Support</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
