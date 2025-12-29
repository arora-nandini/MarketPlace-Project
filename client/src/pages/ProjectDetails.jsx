import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useSelector } from "react-redux";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.project);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // DELETE PROJECT
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Project deleted!");
      navigate("/projects");

    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  if (!project)
    return <p className="text-center mt-10 text-red-500">Project not found.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — IMAGES */}
        <div>
          <img
            src={project.images?.[0]?.url || "/placeholder.webp"}
            alt={project.title}
            className="w-full h-80 object-cover rounded shadow"
          />

          <div className="flex gap-2 mt-3 overflow-x-auto">
            {project.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt=""
                className="w-20 h-20 rounded border object-cover"
              />
            ))}
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>

          <p className="text-lg text-green-600 font-semibold mt-2">
            ₹ {project.price}
          </p>

          <p className="text-gray-700 mt-4">{project.description}</p>

          <p className="mt-3 text-sm text-gray-600">
            <span className="font-semibold">Tech Stack:</span>{" "}
            {project.techStack?.join(", ") || "None"}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            <span className="font-semibold">Type:</span> {project.type}
          </p>

          {project.type === "physical" && (
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">Stock:</span> {project.kitStock}
            </p>
          )}

          {/* Seller Info */}
          <div className="mt-4 p-3 bg-gray-100 border rounded">
            <p className="font-semibold">Seller:</p>
            <p>{project.seller?.name}</p>
            <p className="text-sm text-gray-600">{project.seller?.email}</p>
          </div>

          {/* BUY NOW */}
          <Link
            to={`/checkout/${project._id}`}
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Buy Now
          </Link>

          {/* SELLER ONLY — EDIT + DELETE BUTTONS */}
          {user && user._id === project.seller?._id && (
            <div className="flex gap-4 mt-6">

              <Link
                to={`/edit/${project._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Project
              </Link>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Project
              </button>

            </div>
          )}
        </div>
      </div>

      {/* OPTIONAL: YouTube Demo Video */}
      {project.demoVideo && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Demo Video</h2>
          <iframe
            src={project.demoVideo.replace("watch?v=", "embed/")}
            className="w-full h-80 rounded shadow"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* OPTIONAL: Cloudinary Video File */}
      {project.videoFile?.url && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Demo Video File</h2>

          <video
            src={project.videoFile.url}
            controls
            className="w-full rounded shadow"
          ></video>
        </div>
      )}
    </div>
  );
}
