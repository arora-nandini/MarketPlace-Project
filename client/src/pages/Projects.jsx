import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading)
    return (
      <div className="text-center text-gray-500 mt-10">Loading projects...</div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">All Projects</h2>

      {projects.length === 0 && (
        <p className="text-gray-600">No projects found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow rounded p-4 border hover:shadow-lg transition"
          >
            {/* Image */}
            <img
              src={p.images?.[0]?.url || "/placeholder.webp"}
              alt={p.title}
              className="w-full h-48 object-cover rounded mb-3"
            />

            {/* Title */}
            <h3 className="text-xl font-bold">{p.title}</h3>

            {/* Price */}
            <p className="text-lg font-semibold text-green-600 mt-1">
              ₹ {p.price}
            </p>

            {/* Tech Stack */}
            <p className="text-gray-600 text-sm mt-2">
              {p.techStack?.join(", ") || "No tech tags"}
            </p>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <Link
                to={`/projects/${p._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Details
              </Link>

              <Link
                to={`/checkout/${p._id}`}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Buy Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
