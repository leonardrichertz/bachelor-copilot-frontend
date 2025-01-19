import React, { useState, lazy, Suspense } from "react";
import axios from "axios";
import { Typography, Box, Button, ButtonGroup } from "@mui/material";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import GrainIcon from "@mui/icons-material/Grain";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WeatherWarnings = lazy(() => import("./WeatherWarnings"));
const ForecastChart = lazy(() => import("./ForecastChart"));
const SavedLocations = lazy(() => import("./SavedLocations"));

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [units, setUnits] = useState("metric");
  const [location, setLocation] = useState(null);

  const getWeatherData = async (lat, lon) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/weather`,
        {
          params: { lat, lon, units },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setWeatherData(response.data);
      setLocation({ lat, lon });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch weather data"
      );
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
      toast.error("Geolocation is not supported by this browser");
      setError("Geolocation is not supported by this browser");
    }
  };

  const saveLocation = async (location) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/location`,
        location,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Location saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save location");
      toast.error("Failed to save location");
    }
  };

  const handleUnitChange = (newUnits) => {
    setUnits(newUnits);
    if (weatherData) {
      getWeatherData(weatherData.lat, weatherData.lon);
    }
  };

  const getTemperatureUnit = () => {
    return units === "metric" ? "°C" : "°F";
  };

  const getWindSpeedUnit = () => {
    return units === "metric" ? "m/s" : "mph";
  };

  const getWeatherIcon = (id) => {
    if (id >= 200 && id <= 232) return <ThunderstormIcon />;
    if (id >= 300 && id <= 321) return <GrainIcon />;
    if (id >= 500 && id <= 531) return <InvertColorsIcon />;
    if (id >= 600 && id <= 622) return <AcUnitIcon />;
    if (id === 800) return <WbSunnyIcon />;
    if (id >= 801 && id <= 804) return <CloudIcon />;
    if (id >= 701 && id <= 781) return <FilterDramaIcon />;
    return null;
  };

  const labels = weatherData?.daily.map((forecast) =>
    new Date(forecast.dt * 1000).toLocaleDateString()
  );

  const temperatureData = weatherData?.daily.map(
    (forecast) => forecast.temp.day
  );
  const humidityData = weatherData?.daily.map((forecast) => forecast.humidity);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3, boxShadow: 3, backgroundColor: "white", color: "black" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Weather Page
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleGetLocation}>
          Get Current Location
        </Button>
        <ButtonGroup variant="contained">
          <Button
            onClick={() => handleUnitChange("metric")}
            disabled={units === "metric"}
          >
            Celsius
          </Button>
          <Button
            onClick={() => handleUnitChange("imperial")}
            disabled={units === "imperial"}
          >
            Fahrenheit
          </Button>
        </ButtonGroup>
        {location && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => saveLocation(location)}
          >
            Save Location
          </Button>
        )}
      </Box>
      <SavedLocations
        onSelectLocation={(loc) => getWeatherData(loc.lat, loc.lon)}
        setLocation={setLocation}
      />
      {error && <Typography color="error">{error}</Typography>}
      {weatherData && weatherData.current ? (
        <Box mt={3}>
          <Typography variant="h6">Current Weather</Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {getWeatherIcon(weatherData.current.weather[0].id)}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {weatherData.current.weather[0].description}
            </Typography>
          </Box>
          <Typography>
            Temperature: {weatherData.current.temp}
            {getTemperatureUnit()}
          </Typography>
          <Typography>
            Feels Like: {weatherData.current.feels_like}
            {getTemperatureUnit()}
          </Typography>
          <Typography>Humidity: {weatherData.current.humidity}%</Typography>
          <Typography>Pressure: {weatherData.current.pressure} hPa</Typography>
          <Typography>
            Wind Speed: {weatherData.current.wind_speed}
            {getWindSpeedUnit()}
          </Typography>
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <Suspense fallback={<div>Loading Warnings...</div>}>
              <WeatherWarnings alerts={weatherData.alerts} />
            </Suspense>
          )}
          {weatherData.daily && weatherData.daily.length > 0 && (
            <Suspense fallback={<div>Loading Forecast...</div>}>
              <ForecastChart
                labels={labels}
                data={temperatureData}
                label="Temperature (°C)"
                borderColor="rgba(255, 99, 132, 1)"
                backgroundColor="rgba(255, 99, 132, 0.2)"
              />
              <ForecastChart
                labels={labels}
                data={humidityData}
                label="Humidity (%)"
                borderColor="rgba(54, 162, 235, 1)"
                backgroundColor="rgba(54, 162, 235, 0.2)"
              />
            </Suspense>
          )}
        </Box>
      ) : (
        <Typography mt={3}>
          No weather data available. Please click the button to get your current
          location.
        </Typography>
      )}
      <ToastContainer />
    </Box>
  );
};

export default Weather;
