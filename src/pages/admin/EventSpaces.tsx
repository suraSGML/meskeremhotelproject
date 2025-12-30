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
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type EventSpace = Tables<'event_spaces'>;
type EventSpaceInsert = TablesInsert<'event_spaces'>;

const AdminEventSpaces = () => {
  const [spaces, setSpaces] = useState<EventSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<EventSpace | null>(null);
  const [formData, setFormData] = useState<Partial<EventSpaceInsert>>({});
  const { toast } = useToast();

  const fetchSpaces = async () => {
    const { data, error } = await supabase
      .from('event_spaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setSpaces(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.name?.toLowerCase().replace(/\s+/g, '-') ?? '';
    const spaceData = { ...formData, slug };

    if (editingSpace) {
      const { error } = await supabase
        .from('event_spaces')
        .update(spaceData)
        .eq('id', editingSpace.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Event space updated successfully' });
    } else {
      const { error } = await supabase
        .from('event_spaces')
        .insert(spaceData as EventSpaceInsert);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Event space created successfully' });
    }

    setIsDialogOpen(false);
    setEditingSpace(null);
    setFormData({});
    fetchSpaces();
  };

  const handleEdit = (space: EventSpace) => {
    setEditingSpace(space);
    setFormData(space);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event space?')) return;

    const { error } = await supabase.from('event_spaces').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Success', description: 'Event space deleted successfully' });
    fetchSpaces();
  };

  const openNewDialog = () => {
    setEditingSpace(null);
    setFormData({ is_active: true });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground">Event Spaces</h1>
          <p className="text-muted-foreground">Manage event venues and spaces</p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Event Space
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price/Hour</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : spaces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No event spaces found.
                </TableCell>
              </TableRow>
            ) : (
              spaces.map((space) => (
                <TableRow key={space.id}>
                  <TableCell className="font-medium">{space.name}</TableCell>
                  <TableCell>{space.capacity} guests</TableCell>
                  <TableCell>${space.price_per_hour}</TableCell>
                  <TableCell>${space.price_per_day}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${space.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {space.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(space)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(space.id)}>
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
              {editingSpace ? 'Edit Event Space' : 'Add New Event Space'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Space Name</Label>
              <Input
                id="name"
                value={formData.name ?? ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description ?? ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity ?? ''}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="price_per_hour">Price/Hour ($)</Label>
                <Input
                  id="price_per_hour"
                  type="number"
                  value={formData.price_per_hour ?? ''}
                  onChange={(e) => setFormData({ ...formData, price_per_hour: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="price_per_day">Price/Day ($)</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  value={formData.price_per_day ?? ''}
                  onChange={(e) => setFormData({ ...formData, price_per_day: parseFloat(e.target.value) })}
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
                {editingSpace ? 'Update Space' : 'Create Space'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEventSpaces;
