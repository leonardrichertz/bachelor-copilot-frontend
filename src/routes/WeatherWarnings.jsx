import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const WeatherWarnings = ({ alerts }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Weather Warnings
      </Typography>
      <List>
        {alerts.map((alert, index) => (
          <ListItem key={index} sx={{ mb: 2, boxShadow: 1 }}>
            <ListItemText
              primary={`${alert.event} (${new Date(
                alert.start * 1000
              ).toLocaleString()} - ${new Date(
                alert.end * 1000
              ).toLocaleString()})`}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {alert.sender_name}
                  </Typography>
                  <br />
                  {alert.description}
                  <br />
                  <strong>Tags:</strong> {alert.tags.join(", ")}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WeatherWarnings;
