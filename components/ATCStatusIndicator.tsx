"use client";

export type ConnectionStatus = "connected" | "connecting" | "error" | "idle";

interface ATCStatusIndicatorProps {
  status: ConnectionStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const statusConfig = {
  connected: {
    className: "status-connected",
    label: "Connected",
    animate: true,
  },
  connecting: {
    className: "status-connecting",
    label: "Connecting",
    animate: true,
  },
  error: {
    className: "status-error",
    label: "Error",
    animate: false,
  },
  idle: {
    className: "status-idle",
    label: "Idle",
    animate: false,
  },
};

const sizeConfig = {
  sm: { dot: "w-2 h-2", pulse: "w-2 h-2" },
  md: { dot: "w-3 h-3", pulse: "w-3 h-3" },
  lg: { dot: "w-4 h-4", pulse: "w-4 h-4" },
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
            className={`absolute ${sizeClass.pulse} rounded-full animate-ping opacity-75`}
            style={{
              background:
                status === "connected"
                  ? "var(--emerald-400)"
                  : "var(--coral-400)",
            }}
          />
        )}
        {/* Main dot */}
        <span
          className={`relative ${sizeClass.dot} rounded-full ${config.className}`}
        />
      </div>
      {showLabel && <span className="text-xs text-muted">{config.label}</span>}
    </div>
  );
}
