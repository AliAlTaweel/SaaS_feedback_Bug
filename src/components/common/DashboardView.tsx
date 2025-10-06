import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Users,
  Bug,
  Zap,
  Plus,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { Project, Feedback } from "@/lib/data";
import { supabase } from "@/lib/supabase";

type Props = {
  onSelectFeedback: (feedback: Feedback) => void; // New prop for selecting feedback
  onNewProject: () => void; // New prop for opening new project modal
  refreshProjects: boolean; // New prop to trigger project refresh
  setRefreshProjects: (refresh: boolean) => void; // New prop to reset refreshProjects
  refreshFeedback: boolean; // New prop to trigger feedback refresh
  setRefreshFeedback: (refresh: boolean) => void; // New prop to reset refreshFeedback
};

export default function DashboardView({
  onSelectFeedback,
  onNewProject,
  refreshProjects,
  setRefreshProjects,
  refreshFeedback,
  setRefreshFeedback,
}: Props) {
  const [recentFeedbackList, setRecentFeedbackList] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const [totalFeedback, setTotalFeedback] = useState(0);
  const [openIssues, setOpenIssues] = useState(0);
  const [resolvedFeedback, setResolvedFeedback] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentFeedback = async () => {
      setLoadingFeedback(true);
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        setErrorFeedback(error.message);
        setRecentFeedbackList([]);
      } else {
        setRecentFeedbackList(data as Feedback[]);
        setErrorFeedback(null);
      }
      setLoadingFeedback(false);
    };

    const fetchProjects = async () => {
      setLoadingProjects(true);
      const { data, error } = await supabase.from("projects").select("*");

      if (error) {
        setErrorProjects(error.message);
        setProjects([]);
      } else {
        setProjects(data as Project[]);
        setErrorProjects(null);
      }
      setLoadingProjects(false);
    };

    const fetchStats = async () => {
      setLoadingStats(true);
      const { count: total, error: totalError } = await supabase
        .from("feedback")
        .select("*", { count: "exact" });

      const { count: open, error: openError } = await supabase
        .from("feedback")
        .select("*", { count: "exact" })
        .eq("status", "open");

      const { count: resolved, error: resolvedError } = await supabase
        .from("feedback")
        .select("*", { count: "exact" })
        .eq("status", "resolved");

      if (totalError || openError || resolvedError) {
        setErrorStats(
          (totalError?.message ||
            openError?.message ||
            resolvedError?.message) as string | null
        );
      } else {
        setTotalFeedback(total || 0);
        setOpenIssues(open || 0);
        setResolvedFeedback(resolved || 0);
        setErrorStats(null);
      }
      setLoadingStats(false);
    };

    fetchRecentFeedback();
    fetchProjects();
    fetchStats();

    if (refreshProjects) {
      fetchProjects();
      fetchStats(); // Stats might also need to be refreshed if new project impacts active project count
      setRefreshProjects(false);
    }

    if (refreshFeedback) {
      fetchRecentFeedback();
      fetchStats();
      setRefreshFeedback(false);
    }
  }, [refreshProjects, refreshFeedback]); // Added refreshFeedback to dependency array

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Overview of your feedback and projects
          </p>
        </div>
        <button
          onClick={onNewProject} // Call onNewProject prop
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loadingStats ? (
          <div className="col-span-4 text-center py-4 text-slate-600">
            Loading stats...
          </div>
        ) : errorStats ? (
          <div className="col-span-4 text-center py-4 text-red-600">
            Error loading stats: {errorStats}
          </div>
        ) : (
          <>
            <StatCard
              icon={MessageSquare}
              label="Total Feedback"
              value={totalFeedback}
              color="bg-blue-500"
            />
            <StatCard
              icon={Clock}
              label="Open Issues"
              value={openIssues}
              color="bg-yellow-500"
            />
            <StatCard
              icon={CheckCircle}
              label="Resolved"
              value={resolvedFeedback}
              color="bg-green-500"
            />
            <StatCard
              icon={Users}
              label="Active Projects"
              value={projects.length}
              color="bg-purple-500"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Feedback
          </h3>
          {loadingFeedback ? (
            <div className="text-center py-4 text-slate-600">
              Loading recent feedback...
            </div>
          ) : errorFeedback ? (
            <div className="text-center py-4 text-red-600">
              Error: {errorFeedback}
            </div>
          ) : recentFeedbackList.length === 0 ? (
            <div className="text-center py-4 text-slate-600">
              No recent feedback.
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                  onClick={() => onSelectFeedback(fb)} // Added onClick handler
                >
                  <div
                    className={`p-2 rounded-lg ${
                      fb.type === "bug" ? "bg-red-100" : "bg-blue-100"
                    }`}
                  >
                    {fb.type === "bug" ? (
                      <Bug size={16} className="text-red-600" />
                    ) : (
                      <Zap size={16} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{fb.title}</p>
                    <p className="text-sm text-slate-600">
                      Project ID: {fb.project_id}
                    </p>
                  </div>
                  <StatusBadge status={fb.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Your Projects
          </h3>
          {loadingProjects ? (
            <div className="text-center py-4 text-slate-600">
              Loading projects...
            </div>
          ) : errorProjects ? (
            <div className="text-center py-4 text-red-600">
              Error: {errorProjects}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-4 text-slate-600">
              No projects found.
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 ${
                      project.color || "bg-gray-500"
                    } rounded-lg flex items-center justify-center text-white font-bold`}
                  >
                    {project.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{project.name}</p>
                    <p className="text-sm text-slate-600">{project.domain}</p>
                  </div>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                    {project.feedbackCount || 0}{" "}
                    {/* Display 0 if feedbackCount is undefined */}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
