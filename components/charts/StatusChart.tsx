"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusChartProps {
  data: { label: string; value: number; color: string }[];
}

export default function StatusChart({ data }: StatusChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        borderWidth: 0,
        spacing: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "#1E293B",
        titleColor: "#F1F5F9",
        bodyColor: "#94A3B8",
        padding: 12,
        cornerRadius: 12,
      },
    },
  };

  return (
    <div className="h-56">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
