import React, { useEffect, useState } from "react";
import { Search, Filter, Bug, Zap, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { Feedback } from "@/lib/data";
import { supabase } from "@/lib/supabase";

type Props = {
  onSelect: (feedback: Feedback) => void;
  refreshFeedback: boolean; // New prop to trigger feedback refresh
  setRefreshFeedback: (refresh: boolean) => void; // New prop to reset refreshFeedback
};

export default function FeedbackView({
  onSelect,
  refreshFeedback,
  setRefreshFeedback,
}: Props) {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("feedback").select("*");

      if (error) {
        setError(error.message);
        setFeedbackList([]);
      } else {
        setFeedbackList(data as Feedback[]);
        setError(null);
      }
      setLoading(false);
    };

    fetchFeedback();

    if (refreshFeedback) {
      fetchFeedback();
      setRefreshFeedback(false);
    }
  }, [refreshFeedback]); // Added refreshFeedback to dependency array

  if (loading) {
    return (
      <div className="text-center py-8 text-slate-600">Loading feedback...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Feedback</h1>
          <p className="text-slate-600 mt-1">
            Manage all user feedback and bug reports
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search feedback..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
          <Filter size={20} />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Project ID
                </th>
                {/* Changed from Project */}
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900"></th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((fb) => (
                <tr
                  key={fb.id}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => onSelect(fb)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {fb.type === "bug" ? (
                        <Bug size={16} className="text-red-500" />
                      ) : (
                        <Zap size={16} className="text-blue-500" />
                      )}
                      <span className="font-medium text-slate-900">
                        {fb.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <p className="text-sm text-slate-600">
                      Project ID: {fb.project_id}
                    </p>
                  </td>
                  {/* Displaying project_id */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fb.type === "bug"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {fb.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={fb.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(fb.created_at).toLocaleDateString()}
                  </td>
                  {/* Formatting date */}
                  <td className="px-6 py-4">
                    <ChevronRight size={20} className="text-slate-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
