"use client";
import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import Sidebar from "@/components/common/Sidebar";
import DashboardView from "@/components/common/DashboardView";
import FeedbackView from "@/components/common/FeedbackView";
import ProjectsView from "@/components/common/ProjectsView";
import FeedbackModal from "@/components/common/FeedbackModal";
import FeedbackForm from "@/components/common/FeedbackForm";
import { Feedback } from "@/lib/data";
import { supabase } from "@/lib/supabase";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState(""); // New state for new project name
  const [newProjectDomain, setNewProjectDomain] = useState(""); // New state for new project domain
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [sidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [refreshProjects, setRefreshProjects] = useState(false); // New state to trigger project refresh
  const [refreshFeedback, setRefreshFeedback] = useState(false); // New state to trigger feedback refresh

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleFeedbackSubmit = async (feedback: {
    title: string;
    description: string;
    email: string;
    type: "bug" | "feature";
    project_id: number;
  }) => {
    if (!user) {
      console.error("User not logged in. Cannot submit feedback.");
      return;
    }

    const { data, error } = await supabase.from("feedback").insert({
      user_id: user.id,
      project_id: feedback.project_id,
      title: feedback.title,
      description: feedback.description,
      type: feedback.type,
      user_email: feedback.email,
    });

    if (error) {
      console.error("Error submitting feedback:", error.message);
    } else {
      console.log("Feedback submitted successfully:", data);
      setRefreshFeedback(true); // Trigger feedback refresh
    }
  };

  const handleNewProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User not logged in. Cannot create project.");
      return;
    }

    const { data, error } = await supabase.from("projects").insert({
      name: newProjectName,
      domain: newProjectDomain || null,
      owner_id: user.id,
    });

    if (error) {
      console.error("Error creating project:", error.message);
    } else {
      console.log("Project created successfully:", data);
      setNewProjectName("");
      setNewProjectDomain("");
      setShowNewProjectModal(false);
      setRefreshProjects(true); // Trigger refresh for project lists
    }
  };

  const handleUpdateFeedbackStatus = async (
    feedbackId: string,
    newStatus: "open" | "in-progress" | "resolved"
  ) => {
    const { data, error } = await supabase
      .from("feedback")
      .update({ status: newStatus })
      .eq("id", feedbackId);

    if (error) {
      console.error("Error updating feedback status:", error.message);
    } else {
      console.log("Feedback status updated successfully:", data);
      setRefreshFeedback(true); // Trigger feedback refresh after update
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {currentView === "dashboard" && (
            <DashboardView
              onSelectFeedback={setSelectedFeedback}
              onNewProject={() => setShowNewProjectModal(true)}
              refreshProjects={refreshProjects}
              setRefreshProjects={setRefreshProjects}
              refreshFeedback={refreshFeedback}
              setRefreshFeedback={setRefreshFeedback}
            />
          )}
          {currentView === "feedback" && (
            <FeedbackView
              onSelect={setSelectedFeedback}
              refreshFeedback={refreshFeedback}
              setRefreshFeedback={setRefreshFeedback}
            />
          )}
          {currentView === "projects" && (
            <ProjectsView
              onNewProject={() => setShowNewProjectModal(true)}
              refreshProjects={refreshProjects}
              setRefreshProjects={setRefreshProjects}
            />
          )}
          {currentView === "settings" && (
            <div className="text-center py-20">
              <Settings size={64} className="mx-auto text-slate-400 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
              <p className="text-slate-600 mt-2">
                Settings view coming soon...
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">New Project</h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleNewProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Awesome Project"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example.com"
                  value={newProjectDomain}
                  onChange={(e) => setNewProjectDomain(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onUpdateStatus={handleUpdateFeedbackStatus} // Pass the new handler
        />
      )}

      {/* Temporary button to open feedback form - replace with a more suitable UI later */}
      <button
        onClick={() => setShowFeedbackForm(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
      >
        Send Feedback
      </button>

      {showFeedbackForm && (
        <FeedbackForm
          onClose={() => setShowFeedbackForm(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}

export default App;
