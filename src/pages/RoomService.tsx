import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Minus, ShoppingCart, Leaf, Flame, X, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentDialog from "@/components/PaymentDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const formSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email required"),
  roomNumber: z.string().min(1, "Room number is required"),
  specialInstructions: z.string().optional(),
});

const RoomService = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      roomNumber: "",
      specialInstructions: "",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["menu-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: menuItems } = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setPendingOrder(values);
    setIsCartOpen(false);
    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentMethod: string, transactionRef: string) => {
    if (!pendingOrder) return;

    try {
      const { error } = await supabase.from("room_service_orders").insert({
        guest_name: pendingOrder.guestName,
        guest_email: pendingOrder.guestEmail,
        room_number: pendingOrder.roomNumber,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        special_instructions: pendingOrder.specialInstructions || null,
        status: "pending",
        payment_status: paymentMethod === "cash" ? "pending" : "paid",
        payment_method: paymentMethod,
        total_amount: cartTotal,
      });

      if (error) throw error;

      setOrderSuccess(true);
      setCart([]);
      form.reset();
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    }
    setPendingOrder(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6 max-w-2xl">
            <Card className="text-center py-12">
              <CardContent className="space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                    Order Placed!
                  </h2>
                  <p className="text-muted-foreground">
                    Your room service order is being prepared. Estimated delivery: 30-45 minutes.
                  </p>
                </div>
                <Button variant="gold" onClick={() => setOrderSuccess(false)}>
                  Order More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        title="Room Service"
        subtitle="Order delicious food delivered directly to your room"
        backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
      />

      {/* Floating Cart Button */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button
            variant="gold"
            size="lg"
            className="fixed bottom-6 right-6 z-40 shadow-lg rounded-full h-16 w-16 p-0"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full text-sm flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">Your Order</SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              {/* Order Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 204" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any dietary restrictions or requests..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" variant="gold" size="lg" className="w-full">
                    Proceed to Payment
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Menu Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Tabs defaultValue={categories?.[0]?.slug || "all"} className="w-full">
            <TabsList className="w-full flex-wrap h-auto gap-2 bg-transparent justify-start mb-8">
              {categories?.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.slug}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories?.map((category) => (
              <TabsContent key={category.id} value={category.slug}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems
                    ?.filter((item) => item.category_id === category.id)
                    .map((item) => (
                      <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                        {item.image_url && (
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-display font-semibold text-lg">{item.name}</h3>
                            <div className="flex gap-1">
                              {item.is_vegetarian && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  <Leaf className="w-3 h-3" />
                                </Badge>
                              )}
                              {item.is_spicy && (
                                <Badge variant="secondary" className="bg-red-100 text-red-700">
                                  <Flame className="w-3 h-3" />
                                </Badge>
                              )}
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              {formatCurrency(item.price)}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {(!menuItems || menuItems.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Menu items coming soon...</p>
            </div>
          )}
        </div>
      </section>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={cartTotal}
        bookingType="room service order"
        onPaymentComplete={handlePaymentComplete}
      />

      <Footer />
    </div>
  );
};

export default RoomService;