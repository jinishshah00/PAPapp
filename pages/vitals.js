import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import styles from "../CSS/vitalsPage.module.css";

export default function VitalsPage({ userRole, isLoggedIn }) {
  const [resource, setResource] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(true);

  const resourceId = "674d2c32a3e492e845bd5f89"; // Static resource ID

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/resources/${resourceId}`
        );
        const resourceData = response.data[0]; // Assuming response returns an array
        setResource(resourceData);
        setEditedTitle(resourceData.title);
        setEditedContent(resourceData.content);
      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedTitle(resource.title);
    setEditedContent(resource.content);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      // Send the updated data to the backend
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/resources/${resourceId}`,
        {
          title: editedTitle,
          content: editedContent,
        },
        { withCredentials: true } // This ensures the user's authentication is sent
      );

      setResource(response.data);
      setIsEditing(false);
      alert("Resource updated successfully!");
    } catch (error) {
      console.error("Error updating resource:", error);
      alert("Failed to update the resource.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!resource) return <p>Resource not found.</p>;

  return (
    <div className={styles.mainCon}>
      {isLoggedIn && userRole === "shelterOwner" && isEditing ? (
        <>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <div>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ marginRight: "10px" }}
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1>{resource.title}</h1>
          <p>{resource.content}</p>
          {isLoggedIn && userRole === "shelterOwner" && (
            <Button variant="outlined" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </>
      )}
      <h3>
        Last Edited by{" "}
        {resource.lastUpdatedBy ? `User ID: ${resource.lastUpdatedBy}` : "Unknown"} -{" "}
        {new Date(resource.updatedAt).toLocaleString()}
      </h3>
    </div>
  );
}
