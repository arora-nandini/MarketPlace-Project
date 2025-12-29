import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);

  const fetchMyProjects = async () => {
    try {
      const { data } = await api.get("/projects/my", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProjects(data.projects);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  // DELETE PROJECT
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProjects((prev) => prev.filter((p) => p._id !== id));
      alert("Project deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto py-6">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Projects</h2>

        <Link
          to="/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Create New Project
        </Link>
      </div>

      {/* NO PROJECTS */}
      {projects.length === 0 && (
        <p className="text-gray-600 text-lg">You have not created any projects yet.</p>
      )}

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow rounded p-4 border hover:shadow-lg transition"
          >
            {/* Thumbnail */}
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

            {/* Type */}
            <p className="text-sm text-gray-600 mt-1 capitalize">
              <span className="font-semibold">Type:</span> {p.type}
            </p>

            {/* Tech Stack */}
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Tech:</span>{" "}
              {p.techStack?.join(", ") || "None"}
            </p>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <Link
                to={`/edit/${p._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
