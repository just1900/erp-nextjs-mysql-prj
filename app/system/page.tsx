"use client";

import { Settings, User, Shield, Bell, Database } from "lucide-react";

export default function SystemPage() {
  const sections = [
    {
      title: "Account Settings",
      description: "Manage your profile and personal information",
      icon: User,
    },
    {
      title: "User Management",
      description: "Manage system users and their permissions",
      icon: Shield,
    },
    {
      title: "Notifications",
      description: "Configure how you receive system alerts",
      icon: Bell,
    },
    {
      title: "Database Management",
      description: "Backup and restore system data",
      icon: Database,
    },
    {
      title: "General Settings",
      description: "Configure system-wide preferences",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
        <p className="mt-2 text-gray-600">Manage your ERP system settings and user permissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <section.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
            </div>
            <p className="text-sm text-gray-500">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
