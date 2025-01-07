"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* Agrupar datos por mes y año */
const groupByMonthAndYear = (data: { fecha: string }[]) => {
  const grouped: Record<string, number> = {};
  data.forEach((item) => {
    const date = new Date(item.fecha);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    grouped[key] = (grouped[key] || 0) + 1;
  });
  return Object.entries(grouped).map(([key, count]) => {
    const [year, month] = key.split("-");
    return { year, month, count };
  });
};

interface BarChartCustProps {
  data: { fecha: string }[];
  title: string;
  config: { label: string; color: string };
  selectedYear?: string; // Año seleccionado desde el componente padre
  selectedMonth?: string; // Mes seleccionado desde el componente padre
}

const BarChartCust: React.FC<BarChartCustProps> = ({
  data,
  title,
  config,
  selectedYear,
  selectedMonth,
}) => {
  const [chartData, setChartData] = useState<
    { year: string; month: string; count: number }[]
  >([]);
  const [filteredData, setFilteredData] = useState<
    { year: string; month: string; count: number }[]
  >([]);

  useEffect(() => {
    const groupedData = groupByMonthAndYear(data);
    setChartData(groupedData);
  }, [data]);

  useEffect(() => {
    let filtered = chartData;

    if (selectedYear !== "Todos") {
      filtered = filtered.filter((item) => item.year === selectedYear);
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((item) => item.month === selectedMonth);
    }

    setFilteredData(filtered);
  }, [selectedYear, selectedMonth, chartData]);

  return (
    <div className="bg-gray-300 p-4 rounded-lg">
      <h4>{title}</h4>
      <ChartContainer config={{ [config.label]: { color: config.color } }}>
        <BarChart data={filteredData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={(item) => `${item.year}-${item.month}`}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) =>
              new Date(value.split("-")[0], parseInt(value.split("-")[1]) - 1)
                .toLocaleString("es-ES", { month: "short" })
                .toUpperCase()
            }
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="count"
            fill={config.color}
            radius={6}
            name={config.label}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default BarChartCust;
