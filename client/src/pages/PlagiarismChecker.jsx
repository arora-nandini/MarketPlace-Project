import { useState } from "react";
import api from "../api/axios";

export default function PlagiarismChecker() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a ZIP file");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("zipFile", file);

    try {
      const { data } = await api.post("/plagiarism", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Extract microservice result from nested 'result' property
      const microserviceResult = data.result ?? {};

      setResult({
        overall_similarity: parseFloat(
          (microserviceResult.overall_similarity ?? 0).toString().replace("%", "")
        ),
        comparisons: Array.isArray(microserviceResult.comparisons)
          ? microserviceResult.comparisons
          : [],
      });
    } catch (err) {
      console.error(err);
      setError("Plagiarism check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Plagiarism Checker
      </h1>

      {/* Upload Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded w-full mb-4"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {loading ? "Checking Plagiarism..." : "Check Plagiarism"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-500 mt-4 text-center font-semibold">
          {error}
        </p>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 p-5 bg-gray-100 rounded border">
          <h2 className="text-2xl font-bold mb-4">Result</h2>

          {/* Overall Similarity */}
          <p className="text-xl font-semibold mb-6">
            Overall Similarity:&nbsp;
            <span
              className={
                result.overall_similarity > 70
                  ? "text-red-600"
                  : result.overall_similarity > 40
                  ? "text-orange-500"
                  : "text-green-600"
              }
            >
              {result.overall_similarity.toFixed(2)}%
            </span>
          </p>

          {/* Comparisons Table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2 text-left">File 1</th>
                  <th className="border p-2 text-left">File 2</th>
                  <th className="border p-2 text-center">Similarity (%)</th>
                </tr>
              </thead>
              <tbody>
                {result.comparisons.length > 0 ? (
                  result.comparisons.map((c, index) => (
                    <tr key={index}>
                      <td className="border p-2">{c.file1}</td>
                      <td className="border p-2">{c.file2}</td>
                      <td
                        className={`border p-2 text-center font-semibold ${
                          c.similarity > 70
                            ? "text-red-600"
                            : c.similarity > 40
                            ? "text-orange-500"
                            : "text-green-600"
                        }`}
                      >
                        {Number(c.similarity).toFixed(2)}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border p-4 text-center text-gray-500">
                      No plagiarism comparisons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
