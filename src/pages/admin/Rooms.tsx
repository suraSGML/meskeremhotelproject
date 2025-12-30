import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Room = Tables<'rooms'>;
type RoomInsert = TablesInsert<'rooms'>;

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<RoomInsert>>({});
  const { toast } = useToast();

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setRooms(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.name?.toLowerCase().replace(/\s+/g, '-') ?? '';
    const roomData = { ...formData, slug };

    if (editingRoom) {
      const { error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', editingRoom.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Room updated successfully' });
    } else {
      const { error } = await supabase
        .from('rooms')
        .insert(roomData as RoomInsert);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Room created successfully' });
    }

    setIsDialogOpen(false);
    setEditingRoom(null);
    setFormData({});
    fetchRooms();
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    const { error } = await supabase.from('rooms').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Success', description: 'Room deleted successfully' });
    fetchRooms();
  };

  const openNewDialog = () => {
    setEditingRoom(null);
    setFormData({ is_active: true, max_guests: 2 });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground">Rooms</h1>
          <p className="text-muted-foreground">Manage hotel rooms and suites</p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price/Night</TableHead>
              <TableHead>Max Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No rooms found. Add your first room to get started.
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.room_type}</TableCell>
                  <TableCell>${room.price_per_night}</TableCell>
                  <TableCell>{room.max_guests}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${room.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {room.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(room.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={formData.name ?? ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="room_type">Room Type</Label>
                <Input
                  id="room_type"
                  value={formData.room_type ?? ''}
                  onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                  placeholder="Suite, Standard, Deluxe"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={formData.short_description ?? ''}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description ?? ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price_per_night">Price per Night ($)</Label>
                <Input
                  id="price_per_night"
                  type="number"
                  value={formData.price_per_night ?? ''}
                  onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="max_guests">Max Guests</Label>
                <Input
                  id="max_guests"
                  type="number"
                  value={formData.max_guests ?? 2}
                  onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="size_sqm">Size (sqm)</Label>
                <Input
                  id="size_sqm"
                  type="number"
                  value={formData.size_sqm ?? ''}
                  onChange={(e) => setFormData({ ...formData, size_sqm: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input
                id="featured_image"
                value={formData.featured_image ?? ''}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active ?? true}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRoom ? 'Update Room' : 'Create Room'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRooms;
