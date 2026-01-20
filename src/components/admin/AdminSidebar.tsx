import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BedDouble, 
  Calendar, 
  UtensilsCrossed, 
  Sparkles, 
  Image, 
  MessageSquare, 
  Settings,
  LogOut,
  Percent,
  Star,
  Flower2,
  Plane,
  ConciergeBell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/admin/room-bookings', icon: Calendar, label: 'Room Bookings' },
  { to: '/admin/events', icon: Calendar, label: 'Event Spaces' },
  { to: '/admin/event-bookings', icon: Calendar, label: 'Event Bookings' },
  { to: '/admin/table-bookings', icon: UtensilsCrossed, label: 'Table Reservations' },
  { to: '/admin/room-service', icon: ConciergeBell, label: 'Room Service' },
  { to: '/admin/spa-bookings', icon: Flower2, label: 'Spa Bookings' },
  { to: '/admin/experience-bookings', icon: Sparkles, label: 'Experience Bookings' },
  { to: '/admin/airport-transfers', icon: Plane, label: 'Airport Transfers' },
  { to: '/admin/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/admin/experiences', icon: Sparkles, label: 'Experiences' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/offers', icon: Percent, label: 'Special Offers' },
  { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { to: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminSidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="font-display text-xl text-sidebar-foreground">Meskerem</h1>
        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};
