import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface SiteSettings {
  [key: string]: {
    id?: string;
    value: Record<string, string | number | boolean>;
  };
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    hotel_name: 'Meskerem Hotel',
    tagline: 'Experience Ethiopian Hospitality',
    email: 'info@meskeremhotel.com',
    phone: '+251 11 123 4567',
    address: 'Addis Ababa, Ethiopia',
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
  });

  const [bookingSettings, setBookingSettings] = useState({
    check_in_time: '14:00',
    check_out_time: '11:00',
    min_advance_booking_days: '1',
    max_advance_booking_days: '365',
    cancellation_policy: 'Free cancellation up to 24 hours before check-in.',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settingsMap: SiteSettings = {};
      data?.forEach((setting) => {
        settingsMap[setting.key] = {
          id: setting.id,
          value: setting.value as Record<string, string | number | boolean>,
        };
      });

      setSettings(settingsMap);

      // Load existing values
      if (settingsMap.general?.value) {
        setGeneralSettings({ ...generalSettings, ...settingsMap.general.value });
      }
      if (settingsMap.social?.value) {
        setSocialSettings({ ...socialSettings, ...settingsMap.social.value });
      }
      if (settingsMap.booking?.value) {
        setBookingSettings({ ...bookingSettings, ...settingsMap.booking.value });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetting = async (key: string, value: Record<string, string | number | boolean>) => {
    setIsSaving(true);
    try {
      if (settings[key]?.id) {
        // Update existing
        const { error } = await supabase
          .from('site_settings')
          .update({ value })
          .eq('id', settings[key].id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('site_settings')
          .insert([{ key, value }]);

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage website settings and configuration</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic hotel information displayed on the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel_name">Hotel Name</Label>
                  <Input
                    id="hotel_name"
                    value={generalSettings.hotel_name}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, hotel_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={generalSettings.tagline}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  rows={2}
                />
              </div>

              <Button
                onClick={() => saveSetting('general', generalSettings)}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Links to your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={socialSettings.facebook}
                    onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={socialSettings.instagram}
                    onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    value={socialSettings.twitter}
                    onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })}
                    placeholder="https://x.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={socialSettings.linkedin}
                    onChange={(e) => setSocialSettings({ ...socialSettings, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={socialSettings.youtube}
                  onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <Button
                onClick={() => saveSetting('social', socialSettings)}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Social Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>Configure booking policies and times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check_in_time">Check-in Time</Label>
                  <Input
                    id="check_in_time"
                    type="time"
                    value={bookingSettings.check_in_time}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, check_in_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_out_time">Check-out Time</Label>
                  <Input
                    id="check_out_time"
                    type="time"
                    value={bookingSettings.check_out_time}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, check_out_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_advance_booking_days">Minimum Advance Booking (days)</Label>
                  <Input
                    id="min_advance_booking_days"
                    type="number"
                    min="0"
                    value={bookingSettings.min_advance_booking_days}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, min_advance_booking_days: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_advance_booking_days">Maximum Advance Booking (days)</Label>
                  <Input
                    id="max_advance_booking_days"
                    type="number"
                    min="1"
                    value={bookingSettings.max_advance_booking_days}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, max_advance_booking_days: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                <Textarea
                  id="cancellation_policy"
                  value={bookingSettings.cancellation_policy}
                  onChange={(e) => setBookingSettings({ ...bookingSettings, cancellation_policy: e.target.value })}
                  rows={3}
                />
              </div>

              <Button
                onClick={() => saveSetting('booking', bookingSettings)}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Booking Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
