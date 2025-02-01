import { useEffect, useState } from "react";
// import { Send } from "lucide-react";

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleApiCall = async () => {
    if (!input.trim()) return;
    setLoading(true);
    console.log("User Input:", input);
    setInput("");
    try {
      const res = await fetch("http://localhost:8080/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error making API call:", error);
      setResponse("Error: Could not fetch response from AI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(response);
  }, [response]);

  return (
    <div className="font-sans flex flex-col h-screen">
      <div className="bg-gray-900 text-white font-semibold text-2xl flex flex-row justify-center p-4">
        Sanket's AI Agent
      </div>
      <div className="flex-grow"></div>
      <div className="flex items-center bg-gray-900 p-4 rounded-xl w-full max-w-2xl mx-auto shadow-lg mb-4 fixed bottom-0 left-1/2 transform -translate-x-1/2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent outline-none text-white text-base px-4"
        />
        <button
          onClick={handleApiCall}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition px-4"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-4 h-4 border-4 border-t-4 border-white rounded-full animate-spin"></div>
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            "Get Response"
          )}
        </button>
        <div className="mt-4">
          <h3 className="font-semibold">Response:</h3>
          <p>{response}</p>
        </div>

        {/* </button> */}
      </div>
    </div>
  );
}
