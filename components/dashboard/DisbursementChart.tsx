"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import type { MonthlyDisbursement } from "@/lib/platform/types";

type DisbursementChartProps = {
  data: MonthlyDisbursement[];
};

type RangeOption = {
  label: string;
  months: number;
};

const RANGE_OPTIONS: RangeOption[] = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "12M", months: 12 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ChartTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-dark/10 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-wide text-dark/50">{label}</p>
      <p className="mt-1 text-base font-bold text-secondary">
        {formatCurrency(Number(payload[0]?.value ?? 0))}
      </p>
    </div>
  );
}

export default function DisbursementChart({ data }: DisbursementChartProps) {
  const [rangeMonths, setRangeMonths] = useState(6);

  const visibleData = useMemo(
    () => data.slice(Math.max(0, data.length - rangeMonths)),
    [data, rangeMonths],
  );

  return (
    <div>
      <div
        className="mb-4 flex w-fit gap-1 rounded-lg bg-muted p-1"
        role="group"
        aria-label="Chart time range"
      >
        {RANGE_OPTIONS.map((option) => (
          <button
            aria-pressed={rangeMonths === option.months}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
              rangeMonths === option.months
                ? "bg-white text-secondary shadow-sm"
                : "text-dark/50 hover:text-secondary"
            }`}
            key={option.label}
            onClick={() => setRangeMonths(option.months)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={visibleData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="disbursementFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#112E58" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#112E58" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EEEDED" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}
              tick={{ fill: "#1E1E1E99" }}
              tickLine={false}
              tickMargin={12}
            />
            <YAxis
              axisLine={false}
              style={{ fontSize: 10, fontWeight: 700 }}
              tick={{ fill: "#1E1E1E99" }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`
              }
              tickLine={false}
              width={40}
            />
            <Tooltip content={ChartTooltip} cursor={{ stroke: "#112E58", strokeDasharray: 4 }} />
            <Area
              activeDot={{ r: 5, stroke: "#112E58", strokeWidth: 2, fill: "#ffffff" }}
              dataKey="amount"
              dot={{ r: 3, fill: "#112E58", strokeWidth: 0 }}
              fill="url(#disbursementFill)"
              stroke="#112E58"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
