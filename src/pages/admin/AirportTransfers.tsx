import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Plane, Car } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type AirportTransfer = Tables<'airport_transfers'>;

const AdminAirportTransfers = () => {
  const [transfers, setTransfers] = useState<AirportTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchTransfers = async () => {
    let query = supabase
      .from('airport_transfers')
      .select('*')
      .order('pickup_datetime', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setTransfers(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransfers();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('airport_transfers')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Success', description: 'Transfer status updated' });
    fetchTransfers();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      completed: 'outline',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPaymentBadge = (status: string | null) => {
    if (status === 'paid') return <Badge variant="default">Paid</Badge>;
    return <Badge variant="outline">Unpaid</Badge>;
  };

  const getTransferTypeIcon = (type: string) => {
    if (type === 'pickup') {
      return <Plane className="w-4 h-4 text-primary" />;
    }
    return <Car className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground">Airport Transfers</h1>
          <p className="text-muted-foreground">Manage airport pickup and dropoff bookings</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : transfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No transfers found.
                </TableCell>
              </TableRow>
            ) : (
              transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransferTypeIcon(transfer.transfer_type)}
                      <span className="capitalize">{transfer.transfer_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transfer.guest_name}</div>
                    <div className="text-xs text-muted-foreground">{transfer.guest_email}</div>
                    {transfer.guest_phone && (
                      <div className="text-xs text-muted-foreground">{transfer.guest_phone}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">From:</span> {transfer.pickup_location}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">To:</span> {transfer.dropoff_location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{format(new Date(transfer.pickup_datetime), 'MMM d, yyyy')}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(transfer.pickup_datetime), 'HH:mm')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {transfer.passengers} passengers, {transfer.luggage_count} bags
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {transfer.vehicle_type}
                    </div>
                    {transfer.flight_number && (
                      <div className="text-xs text-muted-foreground">
                        Flight: {transfer.flight_number}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>ETB {transfer.total_amount}</TableCell>
                  <TableCell>{getPaymentBadge(transfer.payment_status)}</TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                  <TableCell>
                    <Select
                      value={transfer.status}
                      onValueChange={(value) => updateStatus(transfer.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirm</SelectItem>
                        <SelectItem value="completed">Complete</SelectItem>
                        <SelectItem value="cancelled">Cancel</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAirportTransfers;
