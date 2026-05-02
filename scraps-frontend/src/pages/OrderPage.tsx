import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
interface Product {
  id: number;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  supplierName: string;
  supplierEmail: string;
  status: string;
}

const OrderPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:8081/api/inventory/all");
        if (!res.ok) throw new Error("Failed to load product");

        const data: Product[] = await res.json();
        const found = data.find((p) => String(p.id) === String(productId));

        if (!found) {
          throw new Error("Product not found");
        }

        setProduct(found);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("http://localhost:8081/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        productName: product.productName,
        quantity,
        price: product.price,
        vendorEmail: user.email,
        supplierEmail: product.supplierEmail,
      }),
    });

    if (!res.ok) throw new Error("Order failed");

    toast.success("Order placed successfully 🎉");

    navigate("/order-success");
  } catch (err: any) {
    toast.error(err.message);
  }
};

  if (loading) {
    return (
      <DashboardLayout role="vendor">
        <div className="max-w-xl mx-auto p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout role="vendor">
        <div className="max-w-xl mx-auto p-6 text-red-500">
          {error || "Product not found"}
        </div>
      </DashboardLayout>
    );
  }

  const isOutOfStock = product.quantity <= 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 10;

  return (
    <DashboardLayout role="vendor">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Place Order</h1>

        <div className="border p-6 rounded-xl bg-white shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package size={18} /> {product.productName}
            </h2>

            {isOutOfStock ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                <AlertTriangle size={12} />
                Low Stock
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-muted-foreground">Category: {product.category}</p>
          <p className="mt-1 text-muted-foreground">Price: ₹{product.price}/kg</p>
          <p className="mt-1 text-muted-foreground">Available: {product.quantity} kg</p>
          <p className="mt-1 text-muted-foreground">Location: {product.location}</p>
          <p className="mt-1 text-muted-foreground">Supplier: {product.supplierEmail}</p>

          <div className="mt-4">
            <label className="text-sm font-semibold">Quantity</label>
            <input
              type="number"
              min={1}
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full mt-2 px-4 py-2 border rounded-lg"
              disabled={isOutOfStock}
            />
          </div>

          <p className="mt-4 font-semibold">Total: ₹{quantity * product.price}</p>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <motion.button
            whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
            onClick={handleOrder}
            disabled={
              placing ||
              isOutOfStock ||
              quantity < 1 ||
              quantity > product.quantity
            }
            className="w-full mt-6 bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isOutOfStock
              ? "Out of Stock"
              : placing
              ? "Placing..."
              : "Place Order"}
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderPage;