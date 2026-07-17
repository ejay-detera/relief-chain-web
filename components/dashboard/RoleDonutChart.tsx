"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import type { RoleBreakdownEntry } from "@/lib/platform/types";

type RoleDonutChartProps = {
  data: RoleBreakdownEntry[];
};

const COLORS: Record<RoleBreakdownEntry["role"], string> = {
  lgu: "#112E58",
  beneficiary: "#6FCA4B",
  merchant: "#E4CF10",
};

function ChartTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0]?.payload as RoleBreakdownEntry | undefined;
  if (!entry) return null;

  return (
    <div className="rounded-lg border border-dark/10 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-wide text-dark/50">{entry.label}</p>
      <p className="mt-1 text-base font-bold text-secondary">{entry.count.toLocaleString()}</p>
    </div>
  );
}

const EMPTY_STATE_DATA: RoleBreakdownEntry[] = [{ role: "lgu", label: "No data", count: 1 }];

export default function RoleDonutChart({ data }: RoleDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, entry) => sum + entry.count, 0);
  const hasData = total > 0;
  const chartData = hasData ? data : EMPTY_STATE_DATA;

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-1 items-center justify-center">
        <div className="h-52 w-52">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={chartData}
                dataKey="count"
                innerRadius="68%"
                nameKey="label"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                outerRadius="100%"
                paddingAngle={hasData ? 3 : 0}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    fill={hasData ? COLORS[entry.role] : "#EEEDED"}
                    key={entry.role}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                  />
                ))}
              </Pie>
              {hasData ? <Tooltip content={ChartTooltip} /> : null}
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-secondary">{total.toLocaleString()}</span>
          <span className="text-[10px] font-bold uppercase text-dark/50">Total</span>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {data.map((entry, index) => (
          <button
            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition hover:bg-muted"
            key={entry.role}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            type="button"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded"
                style={{ backgroundColor: COLORS[entry.role] }}
              />
              <span className="text-secondary">{entry.label}</span>
            </div>
            <span className="font-bold text-secondary">
              {total > 0 ? Math.round((entry.count / total) * 100) : 0}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
