import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

import { useParking } from "@/context/parking";
import { formatMoney } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Panel,
  PanelBody,
  PanelDescription,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

/* Recharts resolves CSS custom properties at paint time, so tokens theme it. */
const axisTick = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };

const tooltipStyles = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "calc(var(--radius) - 2px)",
    boxShadow: "0 12px 28px -8px hsl(var(--shadow-tint) / 0.18)",
    fontSize: 12,
    color: "hsl(var(--popover-foreground))",
  },
  labelStyle: { color: "hsl(var(--muted-foreground))", marginBottom: 2 },
  itemStyle: { color: "hsl(var(--popover-foreground))" },
  cursor: { fill: "hsl(var(--muted))" },
};

const AnalyticsDashboard = () => {
  const { dailyRevenue, vehicleTypeDistribution } = useParking();

  const hasRevenue = dailyRevenue.some((entry) => entry.amount > 0);
  const totalVehicles = vehicleTypeDistribution.reduce(
    (sum, entry) => sum + entry.count,
    0
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel>
        <PanelHeader>
          <PanelHeading>
            <PanelIcon>
              <BarChart3 />
            </PanelIcon>
            <div>
              <PanelTitle>Daily revenue</PanelTitle>
              <PanelDescription>Takings per day, in KSh</PanelDescription>
            </div>
          </PanelHeading>
        </PanelHeader>

        <PanelBody className="pt-6">
          {hasRevenue ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyRevenue}
                  margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis tick={axisTick} tickLine={false} axisLine={false} width={56} />
                  <Tooltip
                    {...tooltipStyles}
                    formatter={(value: number) => [
                      `KSh ${formatMoney(value)}`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No revenue recorded yet"
              description="Takings appear here once vehicles have been released and charged."
            />
          )}
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader>
          <PanelHeading>
            <PanelIcon>
              <PieChartIcon />
            </PanelIcon>
            <div>
              <PanelTitle>Vehicle mix</PanelTitle>
              <PanelDescription>
                Share of visits by vehicle type
              </PanelDescription>
            </div>
          </PanelHeading>
        </PanelHeader>

        <PanelBody className="pt-6">
          {totalVehicles > 0 ? (
            <div className="relative h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleTypeDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="type"
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {vehicleTypeDistribution.map((entry, index) => (
                      <Cell
                        key={entry.type}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    {...tooltipStyles}
                    formatter={(value: number, name) => [`${value} visits`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Donut centre carries the total so the chart answers "how many?" too. */}
              <div className="pointer-events-none absolute inset-x-0 top-[45%] -translate-y-1/2 text-center">
                <p
                  data-numeric
                  className="text-2xl font-semibold tracking-tight text-foreground"
                >
                  {totalVehicles}
                </p>
                <p className="text-2xs uppercase tracking-wider text-muted-foreground">
                  Visits
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={PieChartIcon}
              title="No visits recorded yet"
              description="The mix of vehicle types builds up as entries are recorded."
            />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
};

export default AnalyticsDashboard;
