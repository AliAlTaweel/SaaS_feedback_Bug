import React from "react";

type Props = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  color: string;
};

export default function StatCard({ icon: Icon, label, value, color }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}
