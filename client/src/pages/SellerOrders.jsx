import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/seller");
      setOrders(data.orders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading seller orders...</p>;

  if (orders.length === 0)
    return <p className="text-center mt-10 text-gray-600">No orders for your projects yet.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard — Orders</h1>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-white border shadow-sm rounded p-4"
          >
            {/* TOP ROW */}
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{o.project.title}</h2>

              <span
                className={`px-3 py-1 rounded text-sm ${
                  o.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {o.status.toUpperCase()}
              </span>
            </div>

            {/* BUYER INFO */}
            <p className="text-gray-700 mt-2">
              Buyer: <span className="font-semibold">{o.buyer?.name}</span>
            </p>
            <p className="text-gray-600 text-sm">{o.buyer?.email}</p>

            {/* PRICE */}
            <p className="mt-2 font-semibold">₹ {o.amount}</p>

            {/* SHIPPING ADDRESS IF PHYSICAL */}
            {o.orderType === "physical" && o.shippingAddress && (
              <div className="mt-2 p-2 bg-gray-100 border rounded">
                <p className="font-semibold text-sm">Shipping Address:</p>
                <p className="text-sm">{o.shippingAddress}</p>
              </div>
            )}

            {/* DATE */}
            <p className="text-xs text-gray-500 mt-3">
              Ordered on: {new Date(o.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
