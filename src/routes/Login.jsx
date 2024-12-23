import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const sanitizeInput = (input) => {
    const element = document.createElement("div");
    element.innerText = input;
    return element.innerHTML;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email: sanitizedEmail,
          password: sanitizedPassword,
        }
      );

      localStorage.setItem("authToken", response.data.token);
      // Redirect to the home page or another page
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
