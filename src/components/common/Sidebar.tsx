import React from "react";
import { MessageSquare, BarChart3, Code, Settings, LogOut } from "lucide-react";

type NavItemProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
};

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  collapsed,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

type SidebarProps = {
  currentView: string;
  setCurrentView: (view: string) => void;
  sidebarOpen: boolean;
};

export default function Sidebar({
  currentView,
  setCurrentView,
  sidebarOpen,
}: SidebarProps) {
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-slate-900 text-white transition-all duration-300 flex flex-col h-screen`}
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <MessageSquare className="text-blue-400" size={28} />
            <span className="font-bold text-xl">FeedbackHub</span>
          </div>
        )}
        {!sidebarOpen && (
          <MessageSquare className="text-blue-400 mx-auto" size={28} />
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavItem
          icon={BarChart3}
          label="Dashboard"
          active={currentView === "dashboard"}
          onClick={() => setCurrentView("dashboard")}
          collapsed={!sidebarOpen}
        />
        <NavItem
          icon={MessageSquare}
          label="Feedback"
          active={currentView === "feedback"}
          onClick={() => setCurrentView("feedback")}
          collapsed={!sidebarOpen}
        />
        <NavItem
          icon={Code}
          label="Projects"
          active={currentView === "projects"}
          onClick={() => setCurrentView("projects")}
          collapsed={!sidebarOpen}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          active={currentView === "settings"}
          onClick={() => setCurrentView("settings")}
          collapsed={!sidebarOpen}
        />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <NavItem icon={LogOut} label="Logout" collapsed={!sidebarOpen} />
      </div>
    </div>
  );
}
