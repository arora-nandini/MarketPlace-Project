import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Project Details
  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data.project);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // PAYMENT START
  const startPayment = async () => {
    if (!project) return;

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      // 1️⃣ Create Razorpay order (backend)
      const { data } = await api.post("/payment/create-order", {
        projectId,
        shippingAddress: "N/A",
      });

      const { razorpayOrder, orderId, keyId } = data;

      // 2️⃣ Razorpay Checkout Options
      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Marketplace",
        description: project.title,
        order_id: razorpayOrder.id,

        handler: async function (response) {
          // 3️⃣ Send payment data to backend for verification
          await api.post("/payment/verify", {
            orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment successful!");

          // Refresh UI or redirect to My Orders
          window.location.href = "/my-orders";
        },

        prefill: {
          name: project.seller?.name || "Buyer",
        },
        theme: { color: "#2C7BE5" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Try again.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (!project)
    return <p className="text-center mt-10 text-red-500">Project not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="flex gap-4 items-center mb-4">
        <img
          src={project.images?.[0]?.url || "/placeholder.webp"}
          className="w-32 h-32 object-cover rounded"
        />
        <div>
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <p className="text-green-600 text-lg">₹ {project.price}</p>
        </div>
      </div>

      <button
        onClick={startPayment}
        className="w-full bg-green-600 text-white py-3 rounded text-xl hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  );
}
