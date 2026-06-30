"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "@/components/providers/ThemeProvider";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ReportsChartProps {
  data: { month: string; count: number }[];
}

export default function ReportsChart({ data }: ReportsChartProps) {
  const { dark } = useTheme();

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Laporan",
        data: data.map((d) => d.count),
        backgroundColor: "rgba(37, 99, 235, 0.8)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: dark ? "#1E293B" : "#FFFFFF",
        titleColor: dark ? "#F1F5F9" : "#0F172A",
        bodyColor: dark ? "#94A3B8" : "#64748B",
        borderColor: dark ? "#334155" : "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: dark ? "#64748B" : "#94A3B8",
          font: { size: 12 },
        },
        border: { display: false },
      },
      y: {
        grid: { color: dark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)" },
        ticks: {
          color: dark ? "#64748B" : "#94A3B8",
          font: { size: 12 },
          stepSize: 1,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}
