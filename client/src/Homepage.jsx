import { useState } from "react";

const Homepage = () => {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Please enter a book title");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setResults([]);
      } else if (!data.length) {
        setResults([]);
        setError("No matches found");
      } else {
        setResults(data);
      }
    } catch (err) {
      setError("Failed to fetch recommendations. Is the server running?");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-200 to-blue-300 font-sans">
      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-4xl text-center transition-transform transform hover:scale-105">
        <h1 className="text-5xl font-extrabold mb-4 text-indigo-900 text-center">
          Book Recommender
        </h1>
        <p className="text-gray-700 mb-8 text-lg text-center">
          Discover your next favorite book with AI-powered recommendations
        </p>

        {/* Search Input */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a book title..."
            className="border-2 border-indigo-300 rounded-l-full p-4 w-72 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-all duration-300 hover:border-indigo-500"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 rounded-r-full hover:bg-indigo-700 disabled:bg-gray-400 transition-colors duration-300"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-6">{error}</p>}

        {/* Results */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 justify-items-center">
            {results.map((book, index) => (
              <div
                key={index}
                className="bg-indigo-50 p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center w-56"
              >
                <h2 className="font-semibold text-lg mb-2 text-indigo-900">
                  {book.title || book}
                </h2>
                {book.author && <p className="text-gray-700">{book.author}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
