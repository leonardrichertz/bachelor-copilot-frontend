import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const SavedLocations = ({ onSelectLocation, setLocation }) => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/locations`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setLocations(response.data);
      } catch (err) {
        setError("Failed to fetch locations");
      }
    };

    fetchLocations();
  }, []);

  const handleDeleteLocation = async (id) => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`${import.meta.env.VITE_API_URL}/location/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setLocations(locations.filter((location) => location.id !== id));
      toast.success("Location deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete location");
    }
  };

  console.log(locations);

  return (
    <Box>
      <h2>Saved Locations</h2>
      <List>
        {locations.map((location) => (
          <ListItem
            key={location.id}
            sx={{ display: "flex", justifyContent: "space-between" }}
            onClick={() => {
              onSelectLocation(location);
              setLocation({ lat: location.lat, lon: location.lon });
            }}
          >
            <ListItemText
              primary={`Lat: ${location.lat}, Lon: ${location.lon}`}
            />
            <Button onClick={setLocation(location)}>Select</Button>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteLocation(location.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SavedLocations;
