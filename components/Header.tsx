"use client";

import ATCStatusIndicator, { ConnectionStatus } from "./ATCStatusIndicator";

interface HeaderProps {
  globalStatus: ConnectionStatus;
}

export default function Header({ globalStatus }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo and Title */}
        <div className="header-brand">
          <div className="text-2xl">✈️</div>
          <div>
            <h1 className="header-title">Lofi ATC</h1>
            <p className="header-subtitle">Ambient aviation radio</p>
          </div>
        </div>

        {/* Global Status */}
        <div className="header-status">
          <span className="header-status-label">Stream Status</span>
          <ATCStatusIndicator status={globalStatus} size="lg" />
        </div>
      </div>
    </header>
  );
}
