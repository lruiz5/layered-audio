"use client";

import ATCStatusIndicator, { ConnectionStatus } from "./ATCStatusIndicator";

interface HeaderProps {
  globalStatus: ConnectionStatus;
}

export default function Header({ globalStatus }: HeaderProps) {
  return (
    <header className="w-full bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">✈️</div>
          <div>
            <h1 className="text-xl font-bold text-white">Lofi ATC</h1>
            <p className="text-xs text-gray-400">Ambient aviation radio</p>
          </div>
        </div>

        {/* Global Status */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Stream Status</span>
          <ATCStatusIndicator status={globalStatus} size="lg" />
        </div>
      </div>
    </header>
  );
}
