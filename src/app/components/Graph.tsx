/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-4 rounded-md shadow-md">
        <p className="font-semibold">{`Test ${label}`}</p>
        <p className="text-primary">{`WPM: ${payload[0].value}`}</p>
        {payload[0].payload.accuracy && (
          <p className="text-secondary">{`Accuracy: ${payload[0].payload.accuracy.toFixed(
            2
          )}%`}</p>
        )}
        {payload[0].payload.timeElapsed && (
          <p className="text-secondary">{`Time: ${payload[0].payload.timeElapsed.toFixed(
            2
          )}s`}</p>
        )}
      </div>
    );
  }
  return null;
};

interface GraphData {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
}

interface GraphProps {
  data: GraphData;
}

export default function Graph({ data }: GraphProps) {
  const [chartData, setChartData] = useState<
    { name: number; wpm: number; accuracy: number; timeElapsed: number }[]
  >([]);

  useEffect(() => {
    // Simulate historical data
    const historicalData = Array.from({ length: 5 }, (_, i) => ({
      name: i + 1,
      wpm: Math.floor(Math.random() * 20) + data.wpm - 10,
      accuracy: Math.random() * 20 + data.accuracy - 10,
      timeElapsed: Math.random() * 10 + data.timeElapsed - 5,
    }));

    setChartData([
      ...historicalData,
      {
        name: 6,
        wpm: data.wpm,
        accuracy: data.accuracy,
        timeElapsed: data.timeElapsed,
      },
    ]);
  }, [data.wpm, data.accuracy, data.timeElapsed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full h-64 mt-8"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{
              value: "Test Number",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis label={{ value: "WPM", angle: -90, position: "insideLeft" }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
