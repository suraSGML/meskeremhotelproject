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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type MenuItem = Tables<'menu_items'>;
type MenuCategory = Tables<'menu_categories'>;
type MenuItemInsert = TablesInsert<'menu_items'>;
type MenuCategoryInsert = TablesInsert<'menu_categories'>;

const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [itemFormData, setItemFormData] = useState<Partial<MenuItemInsert>>({});
  const [categoryFormData, setCategoryFormData] = useState<Partial<MenuCategoryInsert>>({});
  const { toast } = useToast();

  const fetchData = async () => {
    const [itemsRes, categoriesRes] = await Promise.all([
      supabase.from('menu_items').select('*').order('display_order'),
      supabase.from('menu_categories').select('*').order('display_order'),
    ]);

    if (itemsRes.error) toast({ title: 'Error', description: itemsRes.error.message, variant: 'destructive' });
    if (categoriesRes.error) toast({ title: 'Error', description: categoriesRes.error.message, variant: 'destructive' });

    setItems(itemsRes.data ?? []);
    setCategories(categoriesRes.data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const { error } = await supabase.from('menu_items').update(itemFormData).eq('id', editingItem.id);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Menu item updated' });
    } else {
      const { error } = await supabase.from('menu_items').insert(itemFormData as MenuItemInsert);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Menu item created' });
    }

    setIsItemDialogOpen(false);
    setEditingItem(null);
    setItemFormData({});
    fetchData();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = categoryFormData.name?.toLowerCase().replace(/\s+/g, '-') ?? '';
    const data = { ...categoryFormData, slug };

    if (editingCategory) {
      const { error } = await supabase.from('menu_categories').update(data).eq('id', editingCategory.id);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Category updated' });
    } else {
      const { error } = await supabase.from('menu_categories').insert(data as MenuCategoryInsert);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Category created' });
    }

    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
    setCategoryFormData({});
    fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Deleted', description: 'Menu item removed' });
    fetchData();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    const { error } = await supabase.from('menu_categories').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Deleted', description: 'Category removed' });
    fetchData();
  };

  const getCategoryName = (id: string | null) => {
    if (!id) return '-';
    return categories.find(c => c.id === id)?.name ?? '-';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Menu Management</h1>
        <p className="text-muted-foreground">Manage restaurant menu items and categories</p>
      </div>

      <Tabs defaultValue="items">
        <TabsList className="mb-6">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setEditingItem(null); setItemFormData({ is_available: true }); setIsItemDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />Add Item
            </Button>
          </div>
          <div className="bg-card rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Dietary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : items.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No menu items found.</TableCell></TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{getCategoryName(item.category_id)}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.is_vegetarian && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">V</span>}
                          {item.is_vegan && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">VG</span>}
                          {item.is_spicy && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">🌶</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setItemFormData(item); setIsItemDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setEditingCategory(null); setCategoryFormData({ is_active: true }); setIsCategoryDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />Add Category
            </Button>
          </div>
          <div className="bg-card rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No categories found.</TableCell></TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>{cat.display_order}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(cat); setCategoryFormData(cat); setIsCategoryDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteCategory(cat.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Menu Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={itemFormData.name ?? ''} onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={itemFormData.category_id ?? ''} onValueChange={(value) => setItemFormData({ ...itemFormData, category_id: value })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={itemFormData.description ?? ''} onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" value={itemFormData.price ?? ''} onChange={(e) => setItemFormData({ ...itemFormData, price: parseFloat(e.target.value) })} required />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" value={itemFormData.image_url ?? ''} onChange={(e) => setItemFormData({ ...itemFormData, image_url: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={itemFormData.is_vegetarian ?? false} onChange={(e) => setItemFormData({ ...itemFormData, is_vegetarian: e.target.checked })} className="rounded" /> Vegetarian</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={itemFormData.is_vegan ?? false} onChange={(e) => setItemFormData({ ...itemFormData, is_vegan: e.target.checked })} className="rounded" /> Vegan</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={itemFormData.is_spicy ?? false} onChange={(e) => setItemFormData({ ...itemFormData, is_spicy: e.target.checked })} className="rounded" /> Spicy</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={itemFormData.is_available ?? true} onChange={(e) => setItemFormData({ ...itemFormData, is_available: e.target.checked })} className="rounded" /> Available</label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsItemDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <Label htmlFor="cat_name">Name</Label>
              <Input id="cat_name" value={categoryFormData.name ?? ''} onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="cat_desc">Description</Label>
              <Textarea id="cat_desc" value={categoryFormData.description ?? ''} onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })} rows={2} />
            </div>
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input id="display_order" type="number" value={categoryFormData.display_order ?? 0} onChange={(e) => setCategoryFormData({ ...categoryFormData, display_order: parseInt(e.target.value) })} />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={categoryFormData.is_active ?? true} onChange={(e) => setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })} className="rounded" /> Active
            </label>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMenu;
