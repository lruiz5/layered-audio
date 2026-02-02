"use client";

export type ConnectionStatus = "connected" | "connecting" | "error" | "idle";

interface ATCStatusIndicatorProps {
  status: ConnectionStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const statusConfig = {
  connected: {
    color: "bg-green-500",
    pulseColor: "bg-green-400",
    label: "Connected",
    animate: true,
  },
  connecting: {
    color: "bg-yellow-500",
    pulseColor: "bg-yellow-400",
    label: "Connecting",
    animate: true,
  },
  error: {
    color: "bg-red-500",
    pulseColor: "bg-red-400",
    label: "Error",
    animate: false,
  },
  idle: {
    color: "bg-gray-500",
    pulseColor: "bg-gray-400",
    label: "Idle",
    animate: false,
  },
};

const sizeConfig = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export default function ATCStatusIndicator({
  status,
  size = "md",
  showLabel = false,
}: ATCStatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        {/* Pulse animation for connected/connecting states */}
        {config.animate && (
          <span
            className={`absolute ${sizeClass} ${config.pulseColor} rounded-full animate-ping opacity-75`}
          />
        )}
        {/* Main dot */}
        <span
          className={`relative ${sizeClass} ${config.color} rounded-full`}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400">{config.label}</span>
      )}
    </div>
  );
}
