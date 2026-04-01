"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface VisitData {
  date: string;
  views: number;
}

interface ComparisonData {
  title: string;
  views: number;
  rating: string;
}

interface AnalyticsChartProps {
  visitData: VisitData[];
  comparison: ComparisonData[];
  currentTitle: string;
}

export function AnalyticsChart({ visitData, comparison, currentTitle }: AnalyticsChartProps) {
  const hasVisitData = visitData.length > 0;

  return (
    <div className="space-y-8">
      {/* Timeline Chart */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Línea de Tiempo de Visitas</h4>
        {hasVisitData ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  dot={{ r: 4, fill: '#dc2626' }}
                  activeDot={{ r: 6 }}
                  name="Visitas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-white/10 rounded-lg">
            Aún no hay datos de visitas registrados. Las visitas se contarán automáticamente.
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {comparison.length > 1 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Tabla Comparativa de Artículos</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Película</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Visitas</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, i) => (
                  <tr
                    key={item.title}
                    className={`border-b border-white/5 ${item.title === currentTitle ? 'bg-red-600/10' : 'hover:bg-white/5'} transition`}
                  >
                    <td className="py-3 px-4 text-muted-foreground">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-white/90">
                      {item.title}
                      {item.title === currentTitle && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-600/20 text-red-400 rounded">actual</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground/80">{item.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-yellow-500">{item.rating} ⭐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
