import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Home() {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      const { data } = await api.get("/projects");
      setLatest(data.projects.slice(0, 6)); // Show only 6 recent projects
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* HERO SECTION */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">
          Engineering Project Marketplace
        </h1>
        <p className="text-gray-600 mb-6">
          Buy & sell ready-made engineering projects, digital source code,
          documentation, and physical kits.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/projects"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Browse Projects
          </Link>

          <Link
            to="/create"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Upload Your Project
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-6">Project Categories</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded text-center border">
            <h3 className="font-bold text-lg mb-2">Digital Projects</h3>
            <p className="text-gray-600 text-sm mb-2">
              Source code + documentation + demo
            </p>
            <Link
              to="/projects"
              className="text-blue-500 underline text-sm"
            >
              View Digital Projects →
            </Link>
          </div>

          <div className="p-6 bg-white shadow rounded text-center border">
            <h3 className="font-bold text-lg mb-2">Physical Kits</h3>
            <p className="text-gray-600 text-sm mb-2">
              Ready-to-use hardware kits with manuals
            </p>
            <Link
              to="/projects"
              className="text-blue-500 underline text-sm"
            >
              View Kits →
            </Link>
          </div>

          <div className="p-6 bg-white shadow rounded text-center border">
            <h3 className="font-bold text-lg mb-2">AI & IoT Projects</h3>
            <p className="text-gray-600 text-sm mb-2">
              ML, AI, IoT & automation projects with full documentation
            </p>
            <Link
              to="/projects"
              className="text-blue-500 underline text-sm"
            >
              Explore AI Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST PROJECTS */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6">Latest Projects</h2>

        {latest.length === 0 ? (
          <p className="text-gray-600">No recent projects.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((p) => (
              <div
                key={p._id}
                className="bg-white shadow rounded p-4 border hover:shadow-lg transition"
              >
                <img
                  src={p.images?.[0]?.url || "/placeholder.webp"}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />

                <h3 className="text-lg font-bold">{p.title}</h3>

                <p className="text-green-600 font-semibold mt-1">
                  ₹ {p.price}
                </p>

                <Link
                  to={`/projects/${p._id}`}
                  className="block mt-3 bg-blue-600 text-white text-center py-1 rounded text-sm"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
