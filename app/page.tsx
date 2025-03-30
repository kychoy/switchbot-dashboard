'use client';

import { useEffect, useState } from 'react';

type Device = {
  deviceId: string;
  deviceName: string;
  deviceType: string;
};

type Status = {
  power?: string;
  temperature?: number;
  humidity?: number;
};

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDevices() {
      try {
        const res = await fetch('/api/switchbot');
        const data = await res.json();
        setDevices(data.body.deviceList || []);
      } catch (err) {
        console.error('Failed to load devices:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDevices();
  }, []);

  async function getDeviceStatus(deviceId: string) {
    try {
      const res = await fetch(`/api/status?id=${deviceId}`);
      const data = await res.json();
      setStatuses(prev => ({ ...prev, [deviceId]: data.body }));
    } catch (err) {
      console.error(`Failed to get status for ${deviceId}:`, err);
    }
  }

  async function toggleDevice(deviceId: string, currentPower?: string) {
    const command = currentPower?.toLowerCase() === 'on' ? 'turnOff' : 'turnOn';
    try {
      await fetch('/api/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, command }),
      });
      await getDeviceStatus(deviceId);
    } catch (err) {
      console.error(`Failed to toggle ${deviceId}`, err);
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">🚀 SwitchBot Dashboard</h1>

      {loading && <p className="text-gray-500">Loading devices...</p>}
      {!loading && devices.length === 0 && (
        <p className="text-red-600">No devices found.</p>
      )}

      <div className="grid gap-6">
        {devices.map((device) => (
          <div
            key={device.deviceId}
            className="border border-gray-300 p-5 rounded-xl bg-white shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">
              {device.deviceName} <span className="text-sm text-gray-400">({device.deviceType})</span>
            </h2>

            <button
              onClick={() => getDeviceStatus(device.deviceId)}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm"
            >
              🔍 Check Status
            </button>

            {statuses[device.deviceId] && (
              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p><strong>Power:</strong> {statuses[device.deviceId].power ?? 'N/A'}</p>
                {statuses[device.deviceId].temperature !== undefined && (
                  <p><strong>🌡️  Temperature:</strong> {statuses[device.deviceId].temperature}°C</p>
                )}
                {statuses[device.deviceId].humidity !== undefined && (
                  <p><strong> 💧  Humidity:</strong> {statuses[device.deviceId].humidity}%</p>
                )}

{statuses[device.deviceId].battery !== undefined && (
  <p><strong>🔋 Battery:</strong> {statuses[device.deviceId].battery}%</p>
)}

                <button
                  onClick={() =>
                    toggleDevice(device.deviceId, statuses[device.deviceId].power)
                  }
                  className={`mt-3 px-4 py-2 rounded text-white text-sm ${
                    statuses[device.deviceId].power?.toLowerCase() === 'on'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {statuses[device.deviceId].power?.toLowerCase() === 'on'
                    ? '🔴 Turn Off'
                    : '🟢 Turn On'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
