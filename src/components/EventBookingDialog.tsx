import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EventSpace {
  id: string;
  name: string;
  capacity: number | null;
  price_per_hour: number | null;
  price_per_day: number | null;
}

interface EventBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventTypes = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Conference',
  'Workshop',
  'Gala Dinner',
  'Anniversary',
  'Other',
];

export const EventBookingDialog = ({ open, onOpenChange }: EventBookingDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventSpaces, setEventSpaces] = useState<EventSpace[]>([]);
  const [formData, setFormData] = useState({
    event_space_id: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    event_type: '',
    event_date: '',
    start_time: '',
    end_time: '',
    expected_guests: '',
    catering_required: false,
    special_requirements: '',
  });

  useEffect(() => {
    const fetchSpaces = async () => {
      const { data } = await supabase
        .from('event_spaces')
        .select('id, name, capacity, price_per_hour, price_per_day')
        .eq('is_active', true);
      setEventSpaces(data || []);
    };
    if (open) fetchSpaces();
  }, [open]);

  const selectedSpace = eventSpaces.find((s) => s.id === formData.event_space_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('event_bookings').insert({
        event_space_id: formData.event_space_id || null,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone || null,
        event_type: formData.event_type,
        event_date: formData.event_date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        expected_guests: formData.expected_guests ? parseInt(formData.expected_guests) : null,
        catering_required: formData.catering_required,
        special_requirements: formData.special_requirements || null,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'Event Inquiry Submitted!',
        description: 'Our events team will contact you within 24 hours.',
      });

      onOpenChange(false);
      setFormData({
        event_space_id: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        event_type: '',
        event_date: '',
        start_time: '',
        end_time: '',
        expected_guests: '',
        catering_required: false,
        special_requirements: '',
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Plan Your Event</DialogTitle>
          <DialogDescription>
            Tell us about your event and we'll help make it unforgettable.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type</Label>
            <Select
              value={formData.event_type}
              onValueChange={(value) => setFormData({ ...formData, event_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_space_id">Preferred Venue (Optional)</Label>
            <Select
              value={formData.event_space_id}
              onValueChange={(value) => setFormData({ ...formData, event_space_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a venue" />
              </SelectTrigger>
              <SelectContent>
                {eventSpaces.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name} {space.capacity ? `(up to ${space.capacity} guests)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Event Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="event_date"
                  type="date"
                  min={today}
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_guests">Expected Guests</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="expected_guests"
                  type="number"
                  min="1"
                  value={formData.expected_guests}
                  onChange={(e) => setFormData({ ...formData, expected_guests: e.target.value })}
                  placeholder="100"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_name">Your Name</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_email">Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_phone">Phone</Label>
              <Input
                id="client_phone"
                type="tel"
                value={formData.client_phone}
                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                placeholder="+251 912 345 678"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="catering_required"
              checked={formData.catering_required}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, catering_required: checked as boolean })
              }
            />
            <Label htmlFor="catering_required" className="text-sm font-normal cursor-pointer">
              I'm interested in catering services
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requirements">Special Requirements (Optional)</Label>
            <Textarea
              id="special_requirements"
              value={formData.special_requirements}
              onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
              placeholder="Tell us about your vision, theme, or any specific needs..."
              rows={3}
            />
          </div>

          <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : 'Submit Inquiry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
