import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Eye, Check } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Inquiry = Tables<'contact_inquiries'>;

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setInquiries(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_inquiries')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Success', description: 'Marked as read' });
    fetchInquiries();
  };

  const markAsResponded = async (id: string) => {
    const { error } = await supabase
      .from('contact_inquiries')
      .update({ is_responded: true, is_read: true })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Success', description: 'Marked as responded' });
    fetchInquiries();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Contact Inquiries</h1>
        <p className="text-muted-foreground">Manage customer inquiries and messages</p>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className={!inquiry.is_read ? 'bg-primary/5' : ''}>
                  <TableCell className="text-sm">
                    {inquiry.created_at ? format(new Date(inquiry.created_at), 'MMM d, yyyy HH:mm') : '-'}
                  </TableCell>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{inquiry.inquiry_type ?? 'General'}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{inquiry.subject ?? inquiry.message.substring(0, 50)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!inquiry.is_read && <Badge variant="secondary">New</Badge>}
                      {inquiry.is_responded && <Badge>Responded</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!inquiry.is_read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(inquiry.id)} title="Mark as read">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {!inquiry.is_responded && (
                        <Button variant="ghost" size="sm" onClick={() => markAsResponded(inquiry.id)} title="Mark as responded">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
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

export default AdminInquiries;
