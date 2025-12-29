import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    techStack: "",
    type: "digital",
    kitStock: 0,
    demoVideo: ""
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
        images: [...prev.images, ...selected], // multiple
      }));
    } else {
      setFiles((prev) => ({ ...prev, [name]: selected[0] })); // single
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    // normal fields
    for (const key in form) {
      fd.append(key, form[key]);
    }

    // images[]
    files.images.forEach((img) => fd.append("images", img));

    // single files
    if (files.codeFile) fd.append("codeFile", files.codeFile);
    if (files.docFile) fd.append("docFile", files.docFile);
    if (files.videoFile) fd.append("videoFile", files.videoFile);

    try {
      const { data } = await api.post("/projects", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Project Created!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow mt-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          rows={3}
          onChange={handleChange}
          required
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        {/* TECH STACK */}
        <input
          type="text"
          name="techStack"
          placeholder="React, NodeJS, Firebase"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        />

        {/* TYPE */}
        <select
          name="type"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        >
          <option value="digital">Digital</option>
          <option value="physical">Physical Kit</option>
        </select>

        {/* KIT STOCK */}
        {form.type === "physical" && (
          <input
            type="number"
            name="kitStock"
            placeholder="Number of Kits"
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />
        )}

        {/* DEMO VIDEO URL */}
        <input
          type="text"
          name="demoVideo"
          placeholder="YouTube Demo Video Link"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        />

        {/* IMAGES */}
        <div>
          <label className="font-semibold">Project Images</label>
          <input
            type="file"
            name="images"
            multiple
            className="w-full mt-1"
            onChange={handleFileChange}
          />
        </div>

        {/* CODE FILE */}
        <div>
          <label className="font-semibold">Source Code (zip/rar)</label>
          <input
            type="file"
            name="codeFile"
            className="w-full mt-1"
            onChange={handleFileChange}
          />
        </div>

        {/* DOCUMENTATION */}
        <div>
          <label className="font-semibold">Documentation (PDF)</label>
          <input
            type="file"
            name="docFile"
            className="w-full mt-1"
            onChange={handleFileChange}
          />
        </div>

        {/* VIDEO FILE */}
        <div>
          <label className="font-semibold">Demo Video (MP4)</label>
          <input
            type="file"
            name="videoFile"
            className="w-full mt-1"
            onChange={handleFileChange}
          />
        </div>

        {/* SUBMIT */}
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Project
        </button>
      </form>
    </div>
  );
}
