interface TrendChartProps {
  data: Array<{
    date: string;
    created: number;
    resolved: number;
  }>;
}

export function TrendChart({ data }: TrendChartProps) {
  const maxValue = Math.max(...data.flatMap(d => [d.created, d.resolved]));
  const chartHeight = 200;

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <div className="flex space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Created</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Resolved</span>
          </div>
        </div>
      </div>
      
      <div className="relative" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={chartHeight * ratio}
              x2="100%"
              y2={chartHeight * ratio}
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Data bars */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const createdHeight = maxValue > 0 ? (item.created / maxValue) * chartHeight * 0.8 : 0;
            const resolvedHeight = maxValue > 0 ? (item.resolved / maxValue) * chartHeight * 0.8 : 0;
            
            return (
              <g key={item.date}>
                {/* Created bar */}
                <rect
                  x={`${x - 2}%`}
                  y={chartHeight - createdHeight}
                  width="2%"
                  height={createdHeight}
                  fill="#3b82f6"
                  className="hover:opacity-80 transition-opacity duration-200"
                  rx="2"
                />
                
                {/* Resolved bar */}
                <rect
                  x={`${x + 1}%`}
                  y={chartHeight - resolvedHeight}
                  width="2%"
                  height={resolvedHeight}
                  fill="#10b981"
                  className="hover:opacity-80 transition-opacity duration-200"
                  rx="2"
                />
              </g>
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={item.date} className={index % 2 === 0 ? "" : "opacity-0"}>
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
