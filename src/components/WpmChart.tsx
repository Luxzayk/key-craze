import { memo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { WpmSample } from "@/hooks/useTyping";

const chartConfig = {
  wpm: {
    label: "PPM",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface Props {
  data: WpmSample[];
}

export const WpmChart = memo(function WpmChart({ data }: Props) {
  if (data.length < 2) return null;

  return (
    <div className="mt-6 w-full">
      <p className="mb-2 text-left font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        ppm en el tiempo
      </p>
      <ChartContainer config={chartConfig} className="aspect-[3/1] h-28 w-full">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
          <XAxis dataKey="t" hide />
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="var(--color-wpm)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
});
