import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  GitBranch, 
  MessageSquare, 
  FileText, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Database,
  FileCode2,
  Layers,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatusBadge } from '../components/project/StatusBadge';
import { ProcessingTimeline } from '../components/project/ProcessingTimeline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useProjectStore } from '../stores/projectStore';
import { useSocket } from '../hooks/useSocket';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProject, isLoading, error, fetchProject, deleteProject } = useProjectStore();
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize socket for live updates
  useSocket();

  useEffect(() => {
    fetchProject(id);
  }, [id, fetchProject]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? All vector data will be permanently removed.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProject(id);
      toast.success('Project deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && !selectedProject) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !selectedProject) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <AlertCircle className="h-12 w-12 text-error mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Project not found</h2>
          <p className="text-slate-400 mb-8">The project you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-8">
        <Link to="/dashboard" className="hover:text-[#1a1a1a] transition-colors underline decoration-2 underline-offset-4">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1a1a1a] truncate max-w-[200px]">{selectedProject.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Info Column */}
        <div className="flex-1 space-y-12">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-5xl font-black text-[#1a1a1a] tracking-tight">{selectedProject.name}</h1>
              <StatusBadge status={selectedProject.status} />
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <a 
                href={selectedProject.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#1a1a1a] transition-colors flex items-center gap-1.5 bg-white border-2 border-[#1a1a1a] px-3 py-1.5 rounded-xl shadow-[2px_2px_0_#1a1a1a] hover:shadow-[4px_4px_0_#1a1a1a]"
              >
                <GitBranch className="h-4 w-4" />
                {selectedProject.repoUrl.replace('https://github.com/', '')}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-8 flex flex-col items-center text-center group bg-accent-start">
              <div className="h-16 w-16 rounded-full border-2 border-[#1a1a1a] bg-white flex items-center justify-center mb-6 shadow-[2px_2px_0_#1a1a1a]">
                <MessageSquare className="h-8 w-8 text-[#1a1a1a]" />
              </div>
              <h3 className="text-2xl font-black text-[#1a1a1a] mb-3">Chat with Code</h3>
              <p className="text-slate-800 text-sm mb-8 leading-relaxed font-medium">
                Ask questions and explain logic based on the codebase's current structure.
              </p>
              <Button 
                disabled={selectedProject.status !== 'ready'} 
                onClick={() => navigate(`/projects/${id}/chat`)}
                className="w-full bg-[#1a1a1a] text-accent-start hover:text-[#1a1a1a] hover:bg-white border-[#1a1a1a]"
              >
                Start Chat
              </Button>
            </Card>

            <Card className="p-8 flex flex-col items-center text-center group bg-accent-cool">
              <div className="h-16 w-16 rounded-full border-2 border-[#1a1a1a] bg-white flex items-center justify-center mb-6 shadow-[2px_2px_0_#1a1a1a]">
                <FileText className="h-8 w-8 text-[#1a1a1a]" />
              </div>
              <h3 className="text-2xl font-black text-[#1a1a1a] mb-3">View Documentation</h3>
              <p className="text-slate-800 text-sm mb-8 leading-relaxed font-medium">
                Explore auto-generated documentation for all modules and functions.
              </p>
              <Button 
                variant="outline" 
                disabled={selectedProject.status !== 'ready'} 
                onClick={() => navigate(`/projects/${id}/docs`)}
                className="w-full bg-white hover:bg-[#1a1a1a] hover:text-white"
              >
                Go to Docs
              </Button>
            </Card>
          </div>

          {/* Detailed Info Card */}
          <Card className="p-0 overflow-hidden bg-white">
            <div className="p-6 border-b-2 border-[#1a1a1a]">
              <h3 className="font-bold text-[#1a1a1a]">Project Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#1a1a1a] text-center bg-slate-50">
              <div className="p-8">
                <FileCode2 className="h-6 w-6 text-[#1a1a1a] mx-auto mb-3" />
                <div className="text-3xl font-black text-[#1a1a1a]">{selectedProject.fileCount || 0}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Files Ingested</div>
              </div>
              <div className="p-8">
                <Layers className="h-6 w-6 text-[#1a1a1a] mx-auto mb-3" />
                <div className="text-3xl font-black text-[#1a1a1a]">{selectedProject.chunkCount || 0}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Vector Chunks</div>
              </div>
              <div className="p-8">
                <Database className="h-6 w-6 text-[#1a1a1a] mx-auto mb-3" />
                <div className="text-3xl font-black text-[#1a1a1a] truncate px-4">{selectedProject.language || 'Detecting...'}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Primary Stack</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 space-y-6">
          <Card className="p-6 bg-white shadow-[4px_4px_0_#1a1a1a]">
            <p className="font-bold text-[#1a1a1a] mb-4">Processing Status</p>
            <ProcessingTimeline status={selectedProject.status} />
          </Card>

          {selectedProject.errorMessage && (
            <div className="p-4 rounded-xl bg-error/10 border-2 border-error text-error flex gap-3 shadow-[2px_2px_0_var(--color-error)]">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-bold mb-1">Processing Failed</p>
                <p className="text-xs font-medium text-error/80">{selectedProject.errorMessage}</p>
              </div>
            </div>
          )}

          <div className="pt-4 px-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-red-200 transition-colors"
            >
              {isDeleting ? <Spinner size="sm" /> : <Trash2 className="h-4 w-4" />}
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
