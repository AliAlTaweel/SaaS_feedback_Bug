import React, { useEffect, useState } from "react";
import { Plus, Settings, Code } from "lucide-react";
import { Project } from "@/lib/data";
import { supabase } from "@/lib/supabase";

type Props = {
  onNewProject: () => void;
  refreshProjects: boolean; // New prop to trigger project refresh
  setRefreshProjects: (refresh: boolean) => void; // New prop to reset refreshProjects
};

export default function ProjectsView({
  onNewProject,
  refreshProjects,
  setRefreshProjects,
}: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*");

      if (error) {
        setError(error.message);
        setProjects([]);
      } else {
        setProjects(data as Project[]);
        setError(null);
      }
      setLoading(false);
    };

    fetchProjects();

    if (refreshProjects) {
      fetchProjects();
      setRefreshProjects(false);
    }
  }, [refreshProjects]); // Added refreshProjects to dependency array

  if (loading) {
    return (
      <div className="text-center py-8 text-slate-600">Loading projects...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">
            Manage your projects and widget installations
          </p>
        </div>
        <button
          onClick={onNewProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 ${
                  project.color || "bg-gray-500"
                } rounded-lg flex items-center justify-center text-white font-bold`}
              >
                {project.name[0]}
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <Settings size={20} />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              {project.name}
            </h3>
            <p className="text-slate-600 text-sm mb-4">{project.domain}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">Feedback</span>
              <span className="font-semibold text-slate-900">
                {project.feedbackCount || 0}
              </span>
            </div>
            <button className="mt-4 w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-2">
              <Code size={16} />
              Get Widget Code
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
