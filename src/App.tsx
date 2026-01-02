import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Accommodations from "./pages/Accommodations";
import Dining from "./pages/Dining";
import Experiences from "./pages/Experiences";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import MyBookings from "./pages/MyBookings";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRooms from "./pages/admin/Rooms";
import AdminRoomBookings from "./pages/admin/RoomBookings";
import AdminEventSpaces from "./pages/admin/EventSpaces";
import AdminEventBookings from "./pages/admin/EventBookings";
import AdminMenu from "./pages/admin/Menu";
import AdminInquiries from "./pages/admin/Inquiries";
import AdminExperiences from "./pages/admin/Experiences";
import AdminGallery from "./pages/admin/Gallery";
import AdminSpecialOffers from "./pages/admin/SpecialOffers";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="rooms" element={<AdminRooms />} />
              <Route path="room-bookings" element={<AdminRoomBookings />} />
              <Route path="events" element={<AdminEventSpaces />} />
              <Route path="event-bookings" element={<AdminEventBookings />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="experiences" element={<AdminExperiences />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="offers" element={<AdminSpecialOffers />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;