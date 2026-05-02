import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Navigation, Search, Filter, Crosshair, ArrowRight } from "lucide-react";
import { SUPPLIER_COORDS, DEFAULT_CENTER, haversineKm, getSupplierCoords } from "@/lib/supplierCoords";
import FreshnessCard from "@/components/FreshnessCard";
import { TrustBadge, getDemoTrustInfo } from "@/components/TrustBadge";
import { useNavigate } from "react-router-dom";

// ─── Custom Marker Icon ──────────────────────────────────────────────────────
const MapPinSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#2d6a4f" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`;

const customMarkerIcon = new L.DivIcon({
  html: MapPinSVG,
  className: "bg-transparent border-none drop-shadow-md",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const userMarkerIcon = new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#f5a623" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`,
  className: "bg-transparent border-none drop-shadow-md",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// ─── Map View Updater ────────────────────────────────────────────────────────
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

// ─── Component ───────────────────────────────────────────────────────────────
interface Product {
  id: number;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  supplierName: string;
  supplierEmail: string;
  expiryDate?: string;
  status: string;
}

interface MappedProduct extends Product {
  lat: number;
  lng: number;
  distance: number;
}

const NearbySuppliers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // User location & map state
  const [userLoc, setUserLoc] = useState<[number, number]>(DEFAULT_CENTER);
  const [locStatus, setLocStatus] = useState<"pending" | "found" | "denied">("pending");
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  // Filters
  const [distanceFilter, setDistanceFilter] = useState<number>(0); // 0 = any
  const [productFilter, setProductFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<number>(0); // 0 = any
  const [showFilters, setShowFilters] = useState(false);

  // 1. Get User Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLoc(loc);
          setMapCenter(loc);
          setLocStatus("found");
        },
        () => {
          setLocStatus("denied");
        }
      );
    } else {
      setLocStatus("denied");
    }
  }, []);

  // 2. Fetch & Map Inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/inventory/all");
        if (!res.ok) throw new Error("Failed to fetch inventory");
        const data: Product[] = await res.json();

        // Map products to coordinates
        const mappedData: MappedProduct[] = data
          .map((item) => {
            const coords = getSupplierCoords(item.supplierEmail);
            if (!coords) return null;
            
            // Add some jitter so markers at the same city don't completely overlap
            const jitterLat = (Math.random() - 0.5) * 0.05;
            const jitterLng = (Math.random() - 0.5) * 0.05;
            
            const lat = coords.lat + jitterLat;
            const lng = coords.lng + jitterLng;
            
            const distance = haversineKm(userLoc[0], userLoc[1], lat, lng);
            
            return { ...item, lat, lng, distance };
          })
          .filter(Boolean) as MappedProduct[];

        setProducts(mappedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch only after we have user location (or denied fallback) to calculate distances
    if (locStatus !== "pending") {
      fetchInventory();
    }
  }, [locStatus, userLoc]);

  // 3. Filter Data
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (distanceFilter > 0 && p.distance > distanceFilter) return false;
      if (priceFilter > 0 && p.price > priceFilter) return false;
      if (productFilter && !p.productName.toLowerCase().includes(productFilter.toLowerCase()) && 
          !p.category.toLowerCase().includes(productFilter.toLowerCase())) return false;
      if (p.quantity <= 0) return false; // hide out of stock
      return true;
    }).sort((a, b) => a.distance - b.distance);
  }, [products, distanceFilter, productFilter, priceFilter]);

  const handleLocateMe = () => {
    if (locStatus === "found") {
      setMapCenter(userLoc);
    } else {
      alert("Location access denied or unavailable. Using default city.");
    }
  };

  return (
    <DashboardLayout role="vendor">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-forest tracking-tighter mb-2">Nearby Suppliers</h1>
        <p className="text-muted-foreground font-medium text-lg max-w-2xl">
          Find surplus inventory close to you. Reduce transport costs and source fresher produce.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-220px)] min-h-[600px]">
        {/* Left Side: Map */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden shadow-soft border-2 border-border/40 relative z-10 flex flex-col bg-card">
          <div className="absolute top-4 right-4 z-[400] flex gap-2">
             <button 
                onClick={handleLocateMe}
                className="bg-white text-forest p-3 rounded-xl shadow-lg border border-border/50 hover:bg-secondary transition-all"
                title="Locate Me"
              >
                <Crosshair size={20} />
             </button>
          </div>
          
          <MapContainer 
            center={mapCenter} 
            zoom={10} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MapUpdater center={mapCenter} />

            {/* User Marker */}
            <Marker position={userLoc} icon={userMarkerIcon} zIndexOffset={1000}>
              <Popup className="rounded-xl">
                <div className="font-bold text-forest">Your Location</div>
                <div className="text-xs text-muted-foreground">{locStatus === 'denied' ? 'Default (Indore)' : 'Current Position'}</div>
              </Popup>
            </Marker>

            {/* Supplier Markers */}
            {filteredProducts.map(p => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={customMarkerIcon}>
                <Popup className="!rounded-2xl !p-0 overflow-hidden min-w-[280px]">
                  <div className="p-4 bg-forest text-white">
                    <h3 className="font-black text-lg leading-tight">{p.productName}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">{p.supplierName}</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Price</p>
                        <p className="font-black text-forest">₹{p.price}/kg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Available</p>
                        <p className="font-black text-forest">{p.quantity}kg</p>
                      </div>
                    </div>
                    
                    <FreshnessCard expiryDate={p.expiryDate} category={p.category} compact />
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-bold flex items-center gap-1 text-accent">
                        <Navigation size={12} /> {p.distance.toFixed(1)} km
                      </span>
                      <button 
                        onClick={() => navigate(`/order/${p.id}`)}
                        className="bg-forest text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-forest/90"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right Side: Filters & List */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
          <div className="card-premium p-6 shrink-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-forest text-xl flex items-center gap-2">
                <Filter size={20} /> Filters
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Search Product</label>
                <div className="relative mt-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="E.g. Tomatoes, Spices..."
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border/40 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-forest transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                  <span>Max Distance</span>
                  <span className="text-accent">{distanceFilter === 0 ? 'Any' : `${distanceFilter} km`}</span>
                </label>
                <input
                  type="range"
                  min="0" max="50" step="5"
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(Number(e.target.value))}
                  className="w-full mt-2 accent-forest"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1">
                  <span>Any</span>
                  <span>50km</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4 custom-scrollbar">
            {loading ? (
              <div className="text-center p-8 text-muted-foreground font-bold text-sm">
                Locating nearby inventory...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="card-premium p-8 text-center bg-secondary/30 border-dashed border-2 border-border/40">
                <MapPin size={32} className="mx-auto text-muted-foreground opacity-30 mb-3" />
                <h3 className="font-black text-forest">No suppliers found</h3>
                <p className="text-xs text-muted-foreground mt-1">Try expanding your search distance.</p>
              </div>
            ) : (
              filteredProducts.map(p => (
                <div key={p.id} className="card-premium p-5 hover:border-accent/40 transition-all group bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-black text-forest text-lg group-hover:text-accent transition-colors">{p.productName}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{p.supplierName}</p>
                    </div>
                    <span className="bg-secondary text-forest font-black text-xs px-2 py-1 rounded-lg">
                      ₹{p.price}/kg
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <FreshnessCard expiryDate={p.expiryDate} category={p.category} compact />
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/40">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-muted-foreground">
                      <Navigation size={14} className="text-accent" /> {p.distance.toFixed(1)} km away
                    </span>
                    <button 
                      onClick={() => navigate(`/order/${p.id}`)}
                      className="text-forest hover:text-accent p-1 transition-colors"
                      title="Order Now"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NearbySuppliers;
