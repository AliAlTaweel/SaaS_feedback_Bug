import React from "react";

type Props = {
  status: "open" | "in-progress" | "resolved";
};

export default function StatusBadge({ status }: Props) {
  const styles: Record<Props["status"], string> = {
    open: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
