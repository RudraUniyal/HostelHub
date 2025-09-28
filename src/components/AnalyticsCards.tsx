interface AnalyticsCardsProps {
  analytics: any;
  isAuthority: boolean;
}

export function AnalyticsCards({ analytics, isAuthority }: AnalyticsCardsProps) {
  const cards = isAuthority ? [
    {
      title: "Total Issues",
      value: analytics.totalIssues,
      icon: "📊",
      gradient: "var(--gradient-primary)",
      glowColor: "rgba(138, 43, 226, 0.3)"
    },
    {
      title: "Open Issues",
      value: analytics.openIssues,
      icon: "🔓",
      gradient: "linear-gradient(45deg, #FF9800, #FF5722)",
      glowColor: "rgba(255, 152, 0, 0.3)"
    },
    {
      title: "In Progress",
      value: analytics.inProgressIssues,
      icon: "⚡",
      gradient: "linear-gradient(45deg, #FFC107, #FF9800)",
      glowColor: "rgba(255, 193, 7, 0.3)"
    },
    {
      title: "Resolved",
      value: analytics.resolvedIssues,
      icon: "✅",
      gradient: "linear-gradient(45deg, #4CAF50, #2E7D32)",
      glowColor: "rgba(76, 175, 80, 0.3)"
    },
    {
      title: "Resolution Rate",
      value: `${analytics.resolutionRate}%`,
      icon: "📈",
      gradient: "var(--gradient-secondary)",
      glowColor: "rgba(3, 218, 198, 0.3)"
    },
    {
      title: "Avg Resolution Time",
      value: `${analytics.avgResolutionTime}h`,
      icon: "⏱️",
      gradient: "linear-gradient(45deg, #9C27B0, #7B1FA2)",
      glowColor: "rgba(156, 39, 176, 0.3)"
    }
  ] : [
    {
      title: "Your Issues",
      value: analytics.totalIssues,
      icon: "📝",
      gradient: "var(--gradient-primary)",
      glowColor: "rgba(138, 43, 226, 0.3)"
    },
    {
      title: "Resolved",
      value: analytics.resolvedIssues,
      icon: "✅",
      gradient: "linear-gradient(45deg, #4CAF50, #2E7D32)",
      glowColor: "rgba(76, 175, 80, 0.3)"
    },
    {
      title: "Pending",
      value: analytics.openIssues + analytics.inProgressIssues,
      icon: "⏳",
      gradient: "linear-gradient(45deg, #FF9800, #FF5722)",
      glowColor: "rgba(255, 152, 0, 0.3)"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="dark-card p-6 hover:scale-105 transition-all duration-300 group"
          style={{ 
            animationDelay: `${index * 100}ms`,
            boxShadow: `0 8px 20px rgba(0, 0, 0, 0.3), 0 0 20px ${card.glowColor}`
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300"
              style={{ background: card.gradient }}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
