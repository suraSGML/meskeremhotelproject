import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Calendar, UtensilsCrossed, MessageSquare, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
  totalRooms: number;
  totalEventSpaces: number;
  pendingRoomBookings: number;
  pendingEventBookings: number;
  unreadInquiries: number;
  totalMenuItems: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    totalEventSpaces: 0,
    pendingRoomBookings: 0,
    pendingEventBookings: 0,
    unreadInquiries: 0,
    totalMenuItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          roomsResult,
          eventSpacesResult,
          pendingRoomBookingsResult,
          pendingEventBookingsResult,
          unreadInquiriesResult,
          menuItemsResult,
        ] = await Promise.all([
          supabase.from('rooms').select('id', { count: 'exact', head: true }),
          supabase.from('event_spaces').select('id', { count: 'exact', head: true }),
          supabase.from('room_bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('event_bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('contact_inquiries').select('id', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('menu_items').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          totalRooms: roomsResult.count ?? 0,
          totalEventSpaces: eventSpacesResult.count ?? 0,
          pendingRoomBookings: pendingRoomBookingsResult.count ?? 0,
          pendingEventBookings: pendingEventBookingsResult.count ?? 0,
          unreadInquiries: unreadInquiriesResult.count ?? 0,
          totalMenuItems: menuItemsResult.count ?? 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Rooms', value: stats.totalRooms, icon: BedDouble, color: 'text-primary' },
    { title: 'Event Spaces', value: stats.totalEventSpaces, icon: Calendar, color: 'text-secondary' },
    { title: 'Pending Room Bookings', value: stats.pendingRoomBookings, icon: Users, color: 'text-gold' },
    { title: 'Pending Event Bookings', value: stats.pendingEventBookings, icon: TrendingUp, color: 'text-accent' },
    { title: 'Unread Inquiries', value: stats.unreadInquiries, icon: MessageSquare, color: 'text-destructive' },
    { title: 'Menu Items', value: stats.totalMenuItems, icon: UtensilsCrossed, color: 'text-burgundy' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Meskerem Hotel Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-semibold text-foreground">
                {isLoading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Activity feed will be displayed here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/admin/rooms" className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors">
              <span className="text-sm font-medium">Manage Rooms</span>
            </a>
            <a href="/admin/room-bookings" className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors">
              <span className="text-sm font-medium">View Room Bookings</span>
            </a>
            <a href="/admin/inquiries" className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors">
              <span className="text-sm font-medium">Check Inquiries</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
