import { useEffect, useState } from "react";
import axios from "axios";

const SendEmail = ({ userId, userEmail }) => {
  const [data, setData] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Fetch recently uploaded data
  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/recent-upload",
          {
            params: { user_id: userId },
          }
        );
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching recent data:", error);
      }
    };

    fetchRecentData();
  }, [userId]);

  const handleSendEmail = async () => {
    if (!subject || !message) {
      setStatus("Subject and Message are required");
      return;
    }

    const emails = data.map((row) => row.email); // Extract emails from data

    try {
      const response = await axios.post("http://127.0.0.1:5000/send-email", {
        emails,
        subject,
        message,
        from_email: userEmail, // Pass the logged-in user's email
      });

      if (response.data.success) {
        setStatus("Emails sent successfully!");
      } else {
        setStatus(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("Failed to send emails");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Send Email</h2>
      <div>
        <label className="block mb-2">Subject:</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <label className="block mb-2">Message:</label>
        <textarea
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSendEmail}
        >
          Send Email
        </button>
      </div>
      {status && <p className="mt-4">{status}</p>}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Recently Uploaded Emails:</h3>
        <ul className="list-disc pl-6">
          {data.map((row) => (
            <li key={row.id}>{row.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SendEmail;
