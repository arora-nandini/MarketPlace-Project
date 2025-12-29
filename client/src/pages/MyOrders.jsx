import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my");
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
    return <p className="text-center mt-10 text-gray-600">Loading your orders...</p>;

  if (orders.length === 0)
    return <p className="text-center mt-10 text-gray-600">You haven't purchased anything yet.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-white border shadow-sm rounded p-4"
          >
            {/* HEADER */}
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">
                {o.project?.title || "Deleted Project"}
              </h2>

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

            {/* PRICE */}
            <p className="mt-2 font-semibold">₹ {o.amount}</p>

            {/* DOWNLOAD for digital */}
            {o.orderType === "digital" && o.downloadUrl && (
              <a
                href={o.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Download Project Files
              </a>
            )}

            {/* SHIPPING ADDRESS for physical */}
            {o.orderType === "physical" && (
              <div className="mt-3 p-2 bg-gray-100 border rounded text-sm">
                <p className="font-semibold">Shipping Address:</p>
                <p>{o.shippingAddress || "No address provided"}</p>
              </div>
            )}

            {/* PROJECT LINK */}
            <Link
              to={`/projects/${o.project?._id}`}
              className="text-blue-600 text-sm mt-3 inline-block"
            >
              View Project
            </Link>

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
