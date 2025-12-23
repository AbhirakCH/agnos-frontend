"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { type PatientFormData } from "@/lib/validators";

type RealTimeData = PatientFormData & {
  status: "typing" | "submitted" | "inactive";
  timestamp: string;
};

export default function StaffView() {
  const [currentPatient, setCurrentPatient] = useState<RealTimeData | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  /**
   * Real-time Subscription Logic
   */
  useEffect(() => {
    // Initialize Pusher Client
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to Channel
    const channel = pusher.subscribe("hospital-form");

    // Check connection state (Optional: for debugging)
    pusher.connection.bind("connected", () =>
      setConnectionStatus("Connected (Live)")
    );
    pusher.connection.bind("disconnected", () =>
      setConnectionStatus("Disconnected")
    );

    // Bind Event "patient-update"
    channel.bind("patient-update", (data: RealTimeData) => {
      console.log("Received update:", data);
      setCurrentPatient(data);
      setLastUpdated(new Date());
    });

    // Cleanup when unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // Helper function to format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour12: false });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Staff Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time Patient Monitoring System
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                connectionStatus.includes("Live")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              ● {connectionStatus}
            </span>
          </div>
        </div>

        {/* Content Section */}
        {!currentPatient ? (
          // State: Waiting for data
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Waiting for patient activity...
            </h3>
            <p className="mt-1 text-gray-500 text-sm">
              Open the Patient Form in another window and start typing.
            </p>
          </div>
        ) : (
          // State: Displaying Data
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Card Header with Status */}
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {currentPatient.firstName?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {currentPatient.firstName || "Unknown"}{" "}
                    {currentPatient.lastName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Last updated: {lastUpdated ? formatTime(lastUpdated) : "-"}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-2 ${
                  currentPatient.status === "typing"
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {currentPatient.status === "typing" && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </span>
                )}
                {currentPatient.status?.toUpperCase() || "ACTIVE"}
              </div>
            </div>

            {/* Form Data Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <DataField
                label="Full Name"
                value={`${currentPatient.firstName} ${
                  currentPatient.middleName || ""
                } ${currentPatient.lastName}`}
              />
              <DataField
                label="Date of Birth"
                value={currentPatient.dateOfBirth}
              />
              <DataField label="Gender" value={currentPatient.gender} />
              <DataField label="Phone" value={currentPatient.phoneNumber} />
              <DataField label="Email" value={currentPatient.email} />
              <DataField
                label="Nationality"
                value={currentPatient.nationality}
              />
              <DataField
                label="Address"
                value={currentPatient.address}
                className="md:col-span-2"
              />

              {/* Optional Fields */}
              {(currentPatient.emergencyContactName ||
                currentPatient.emergencyContactRelationship) && (
                <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataField
                      label="Name"
                      value={currentPatient.emergencyContactName}
                    />
                    <DataField
                      label="Relationship"
                      value={currentPatient.emergencyContactRelationship}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Component for UI consistency
function DataField({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div
        className={`text-sm font-medium ${
          value ? "text-gray-900" : "text-gray-300 italic"
        }`}
      >
        {value || "Not provided"}
      </div>
    </div>
  );
}
