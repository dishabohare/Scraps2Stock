import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VendorDashboard from "./pages/VendorDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import Marketplace from "./pages/Marketplace";
import OrderPage from "./pages/OrderPage";
import OrderSuccess from "./pages/OrderSuccess";
import AddInventory from "./pages/AddInventory";
import ManageListings from "./pages/ManageListings";
import SupplierOrders from "./pages/SupplierOrders";
import VendorOrders from "./pages/VendorOrders";
import ProfilePage from "./pages/ProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import CreateBid from "./pages/CreateBid";
import BidRequests from "./pages/BidRequests";
import OfferComparison from "./pages/OfferComparison";
import NearbySuppliers from "./pages/NearbySuppliers";
import AdminDisputes from "./pages/AdminDisputes";
import About from "./pages/About";
import Features from "./pages/Features";

import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationProvider } from "@/context/NotificationContext";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <NotificationProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/vendor/login" element={<LoginPage lockedRole="vendor" />} />
        <Route path="/supplier/login" element={<LoginPage lockedRole="supplier" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/vendor/signup" element={<SignupPage lockedRole="vendor" />} />
        <Route path="/supplier/signup" element={<SignupPage lockedRole="supplier" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/vendor/create-bid" element={<CreateBid />} />
        <Route path="/vendor/bids" element={<CreateBid />} />
        <Route path="/supplier/bid-requests" element={<BidRequests />} />
        <Route path="/vendor/offers/:bidId" element={<OfferComparison />} />

        {/* Vendor Protected Routes */}
        <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRole="VENDOR"><VendorDashboard /></ProtectedRoute>} />
        <Route path="/vendor/orders" element={<ProtectedRoute allowedRole="VENDOR"><VendorOrders /></ProtectedRoute>} />
        <Route path="/vendor/nearby" element={<ProtectedRoute allowedRole="VENDOR"><NearbySuppliers /></ProtectedRoute>} />

        {/* Supplier Protected Routes */}
        <Route path="/supplier/dashboard" element={<ProtectedRoute allowedRole="SUPPLIER"><SupplierDashboard /></ProtectedRoute>} />
        <Route path="/supplier/add-inventory" element={<ProtectedRoute allowedRole="SUPPLIER"><AddInventory /></ProtectedRoute>} />
        <Route path="/supplier/listings" element={<ProtectedRoute allowedRole="SUPPLIER"><ManageListings /></ProtectedRoute>} />
        <Route path="/supplier/orders" element={<ProtectedRoute allowedRole="SUPPLIER"><SupplierOrders /></ProtectedRoute>} />

        {/* Common Protected */}
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/order/:productId" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

        {/* Admin Demo */}
        <Route path="/admin/disputes" element={<AdminDisputes />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
  </NotificationProvider>
  </ThemeProvider>
);

export default App;