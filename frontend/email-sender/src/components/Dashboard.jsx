import { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../services/supabaseClient";

const Dashboard = () => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updatingScheduled, setUpdatingScheduled] = useState(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      } else if (error) {
        console.error("Error fetching user email:", error.message);
        setError("Error fetching user details.");
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    const fetchEmailLogs = async () => {
      if (!userEmail) return;

      try {
        const response = await axios.get("http://127.0.0.1:5000/dashboard", {
          params: { user_email: userEmail },
        });

        if (response.data.success) {
          setEmailLogs(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch email logs.");
        }
      } catch (err) {
        console.error("Error fetching email logs:", err);
        setError("Error fetching email logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmailLogs();
  }, [userEmail]);

  const handleUpdateStatus = async () => {
    const successfulLogs = emailLogs.filter((log) => log.status === "success");

    if (successfulLogs.length === 0) {
      alert("No successful emails to update!");
      return;
    }

    setUpdating(true);
    const messageIds = successfulLogs.map((log) => log.message_id);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/update-email-status",
        {
          message_ids: messageIds,
        }
      );

      if (response.data.success) {
        alert("Statuses updated successfully!");
        setEmailLogs((prevLogs) =>
          prevLogs.map((log) => {
            const updatedLog = response.data.updated_logs.find(
              (u) => u.message_id === log.message_id
            );
            return updatedLog ? { ...log, update: updatedLog.update } : log;
          })
        );
      } else {
        alert("Failed to update statuses.");
      }
    } catch (error) {
      console.error("Error updating statuses:", error);
      alert("Error updating statuses.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateScheduled = async () => {
    const scheduledLogs = emailLogs.filter((log) =>
      log.status.startsWith("scheduled at")
    );

    if (scheduledLogs.length === 0) {
      alert("No scheduled emails to update!");
      return;
    }

    setUpdatingScheduled(true);
    const messageIds = scheduledLogs.map((log) => log.message_id);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/update-scheduled-emails",
        { message_ids: messageIds }
      );

      if (response.data.success) {
        alert("Scheduled emails updated successfully!");
        setEmailLogs((prevLogs) =>
          prevLogs.map((log) => {
            const updatedLog = response.data.updated_logs.find(
              (u) => u.message_id === log.message_id
            );
            return updatedLog ? { ...log, status: updatedLog.new_status } : log;
          })
        );
      } else {
        alert("Failed to update scheduled emails.");
      }
    } catch (error) {
      console.error("Error updating scheduled emails:", error);
      alert("Error updating scheduled emails.");
    } finally {
      setUpdatingScheduled(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center" style={{ color: "black" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "black",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Dashboard
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={handleUpdateStatus}
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            opacity: updating ? 0.5 : 1,
          }}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Statuses"}
        </button>
        <button
          onClick={handleUpdateScheduled}
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            opacity: updatingScheduled ? 0.5 : 1,
          }}
          disabled={updatingScheduled}
        >
          {updatingScheduled ? "Updating..." : "Update Scheduled Emails"}
        </button>
      </div>
      {emailLogs.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              backgroundColor: "#f9f9f9",
              textAlign: "left",
              color: "black",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#333", color: "#fff" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Email
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Status
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Update
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {emailLogs.map((log, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2",
                    cursor: "pointer",
                  }}
                >
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {log.email}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {log.status}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {log.update || "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "black" }}>
          No logs available.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
