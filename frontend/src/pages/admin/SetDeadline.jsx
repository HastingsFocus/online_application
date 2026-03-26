import { useEffect, useState } from "react";
import API from "../../services/api"; // ✅ FIXED

function SetDeadline() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // Load existing
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/settings");

        if (res.data) {
          setStart(res.data.applicationStart?.slice(0, 16) || "");
          setEnd(res.data.applicationEnd?.slice(0, 16) || "");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const s = new Date(start);
    const eDate = new Date(end);

    if (s < now) {
      alert("Start date cannot be in the past");
      return;
    }

    if (eDate <= s) {
      alert("End must be after start");
      return;
    }

    try {
      await API.post("/settings", {
        applicationStart: start,
        applicationEnd: end,
      });

      alert("✅ Deadline updated successfully");
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Failed to update deadline");
    }
  };

  return (
    <div className="p-10">
      <h2>Set Deadline</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <button>Save</button>
      </form>
    </div>
  );
}

export default SetDeadline;