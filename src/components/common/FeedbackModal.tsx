import React, { useState } from "react";
import { Bug, Zap, X } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { Feedback } from "@/lib/data";

type Props = {
  feedback: Feedback | null;
  onClose: () => void;
  onUpdateStatus: (
    feedbackId: string,
    newStatus: "open" | "in-progress" | "resolved"
  ) => void; // New prop
};

export default function FeedbackModal({
  feedback,
  onClose,
  onUpdateStatus,
}: Props) {
  const [currentStatus, setCurrentStatus] = useState<
    "open" | "in-progress" | "resolved" | undefined
  >(feedback?.status);

  // Update currentStatus when feedback prop changes
  React.useEffect(() => {
    setCurrentStatus(feedback?.status);
  }, [feedback]);

  if (!feedback) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value as "open" | "in-progress" | "resolved");
  };

  const handleUpdateClick = () => {
    if (currentStatus && feedback) {
      onUpdateStatus(feedback.id, currentStatus);
      onClose(); // Close modal after updating
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {feedback.type === "bug" ? (
              <Bug size={24} className="text-red-500" />
            ) : (
              <Zap size={24} className="text-blue-500" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {feedback.title}
              </h2>
              <p className="text-slate-600">{feedback.project_id}</p>{" "}
              {/* Displaying project_id for now */}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <StatusBadge status={feedback.status} />
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                feedback.type === "bug"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {feedback.type}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {feedback.priority}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600">{feedback.description}</p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Submitted by</p>
                <p className="font-medium text-slate-900">
                  {feedback.user_email}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <select
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentStatus || ""} // Use currentStatus here
              onChange={handleStatusChange}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              onClick={handleUpdateClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
