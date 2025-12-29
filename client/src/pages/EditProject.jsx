import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    techStack: "",
    type: "digital",
    kitStock: 0,
    demoVideo: "",
  });

  const [files, setFiles] = useState({
    images: [],
    codeFile: null,
    docFile: null,
    videoFile: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;
    if (name === "images") {
      setFiles((prev) => ({
        ...prev,
        images: [...prev.images, ...selected],
      }));
    } else {
      setFiles((prev) => ({ ...prev, [name]: selected[0] }));
    }
  };

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.project);

      setForm({
        title: data.project.title,
        description: data.project.description,
        price: data.project.price,
        techStack: data.project.techStack.join(","),
        type: data.project.type,
        kitStock: data.project.kitStock,
        demoVideo: data.project.demoVideo || "",
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    for (const key in form) fd.append(key, form[key]);

    files.images.forEach((img) => fd.append("images", img));
    if (files.codeFile) fd.append("codeFile", files.codeFile);
    if (files.docFile) fd.append("docFile", files.docFile);
    if (files.videoFile) fd.append("videoFile", files.videoFile);

    try {
      await api.put(`/projects/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Project updated successfully!");
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading project...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          className="w-full border px-3 py-2 rounded"
          rows={3}
          onChange={handleChange}
          required
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={form.price}
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        {/* Tech Stack */}
        <input
          type="text"
          name="techStack"
          value={form.techStack}
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        />

        {/* Type */}
        <select
          name="type"
          value={form.type}
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        >
          <option value="digital">Digital</option>
          <option value="physical">Physical</option>
        </select>

        {/* Kit Stock */}
        {form.type === "physical" && (
          <input
            type="number"
            name="kitStock"
            value={form.kitStock}
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />
        )}

        {/* Demo Video */}
        <input
          type="text"
          name="demoVideo"
          value={form.demoVideo}
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        />

        {/* FILE UPLOADS */}
        <div>
          <label className="font-semibold">Add New Images</label>
          <input type="file" name="images" multiple onChange={handleFileChange} />
        </div>

        <div>
          <label className="font-semibold">Replace Code File</label>
          <input type="file" name="codeFile" onChange={handleFileChange} />
        </div>

        <div>
          <label className="font-semibold">Replace Documentation PDF</label>
          <input type="file" name="docFile" onChange={handleFileChange} />
        </div>

        <div>
          <label className="font-semibold">Replace Video File</label>
          <input type="file" name="videoFile" onChange={handleFileChange} />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
