import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ForecastChart = ({
  labels,
  data,
  label,
  borderColor,
  backgroundColor,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>{label} Forecast</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ForecastChart;
