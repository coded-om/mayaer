import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { InvestmentAllocation } from "@/types/markets";

interface AllocationChartProps {
  allocation: InvestmentAllocation;
}

const COLORS: Record<keyof InvestmentAllocation, string> = {
  stocks: "#6366f1",
  sukuk: "#10b981",
  gold: "#f59e0b",
  realEstate: "#8b5cf6",
  cash: "#64748b",
};

export function AllocationChart({ allocation }: AllocationChartProps) {
  const { t } = useTranslation();

  const data = (Object.keys(allocation) as (keyof InvestmentAllocation)[])
    .filter((k) => allocation[k] > 0)
    .map((key) => ({
      name: t(`advisor.allocation.${key}`),
      value: allocation[key],
      color: COLORS[key],
    }));

  return (
    <div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value)}%`, ""]}
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                fontFamily: "inherit",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="font-arabic text-xs text-neutral-muted dark:text-gray-400">
              {d.name} ({d.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
