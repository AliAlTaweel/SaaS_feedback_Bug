import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/data";

type Props = {
  onClose: () => void;
  onSubmit: (feedback: {
    title: string;
    description: string;
    email: string;
    type: "bug" | "feature";
    project_id: number;
  }) => void;
};

export default function FeedbackForm({ onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"bug" | "feature">("bug");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  ); // New state for submission message

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      const { data, error } = await supabase
        .from("projects")
        .select("id, name");

      if (error) {
        setErrorProjects(error.message);
        setProjects([]);
      } else {
        setProjects(data as Project[]);
        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
        setErrorProjects(null);
      }
      setLoadingProjects(false);
    };

    fetchProjects();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId === null) {
      alert("Please select a project.");
      return;
    }
    onSubmit({
      title,
      description,
      email,
      type,
      project_id: selectedProjectId,
    });
    setTitle(""); // Clear title after submission
    setDescription(""); // Clear description after submission
    setSubmissionMessage("Feedback submitted successfully! Add more below."); // Show success message
    // onClose(); // Removed onClose to keep the form open
  };

  if (loadingProjects) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center text-slate-600">
          Loading projects...
        </div>
      </div>
    );
  }

  if (errorProjects) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center text-red-600">
          Error loading projects: {errorProjects}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Submit Feedback</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {submissionMessage && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center">
              {submissionMessage}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project
            </label>
            <select
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedProjectId || ""}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              required
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Detailed description of feedback or bug"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Feedback Type
            </label>
            <select
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value as "bug" | "feature")}
            >
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Another Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
