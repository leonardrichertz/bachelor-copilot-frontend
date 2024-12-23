import React, { useState } from "react";
import axios from "axios";
import { Typography, Box, Button } from "@mui/material";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const getWeatherData = async (lat, lon) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/weather`,
        {
          params: { lat, lon },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("Failed to fetch weather data");
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherData(latitude, longitude);
        },
        () => {
          setError("Failed to get location");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Weather Page
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGetLocation}>
        Get Current Location
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {weatherData && weatherData.current ? (
        <Box mt={3}>
          <Typography variant="h6">Current Weather</Typography>
          <Typography>Temperature: {weatherData.current.temp}°K</Typography>
          <Typography>Humidity: {weatherData.current.humidity}%</Typography>
          <Typography>Pressure: {weatherData.current.pressure} hPa</Typography>
        </Box>
      ) : (
        <Typography mt={3}>
          No weather data available. Please click the button to get your current
          location.
        </Typography>
      )}
    </Box>
  );
};

export default Weather;
