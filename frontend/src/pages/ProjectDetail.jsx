import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Github, 
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
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-300 truncate max-w-[200px]">{selectedProject.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Info Column */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">{selectedProject.name}</h1>
              <StatusBadge status={selectedProject.status} />
            </div>

            <div className="flex items-center gap-2 text-slate-400 group">
              <Github className="h-5 w-5" />
              <a 
                href={selectedProject.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent-end transition-colors flex items-center gap-1.5"
              >
                {selectedProject.repoUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="hover:border-accent-start/30 transition-colors p-8 flex flex-col items-center text-center group">
              <div className="h-14 w-14 rounded-2xl bg-accent-start/10 flex items-center justify-center mb-6 group-hover:bg-accent-start/20 transition-colors text-accent-start">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Chat with Code</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Ask questions and explain logic based on the codebase's current structure.
              </p>
              <Button 
                disabled={selectedProject.status !== 'ready'} 
                onClick={() => navigate(`/projects/${id}/chat`)}
                className="w-full"
              >
                Start Chat
              </Button>
            </Card>

            <Card className="hover:border-accent-end/30 transition-colors p-8 flex flex-col items-center text-center group">
              <div className="h-14 w-14 rounded-2xl bg-accent-end/10 flex items-center justify-center mb-6 group-hover:bg-accent-end/20 transition-colors text-accent-end">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">View Documentation</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Explore auto-generated documentation for all modules and functions.
              </p>
              <Button 
                variant="outline" 
                disabled={selectedProject.status !== 'ready'} 
                onClick={() => navigate(`/projects/${id}/docs`)}
                className="w-full"
              >
                Go to Docs
              </Button>
            </Card>
          </div>

          {/* Detailed Info Card */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-bold text-white">Project Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5 text-center">
              <div className="p-8">
                <FileCode2 className="h-6 w-6 text-slate-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">{selectedProject.fileCount || 0}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Files Ingested</div>
              </div>
              <div className="p-8">
                <Layers className="h-6 w-6 text-slate-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">{selectedProject.chunkCount || 0}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Vector Chunks</div>
              </div>
              <div className="p-8">
                <Database className="h-6 w-6 text-slate-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white truncate px-4">{selectedProject.language || 'Detecting...'}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Primary Stack</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 space-y-6">
          <Card className="p-6 bg-slate-900/30">
            <ProcessingTimeline status={selectedProject.status} />
          </Card>

          {selectedProject.errorMessage && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-bold mb-1">Processing Failed</p>
                <p className="text-xs opacity-90">{selectedProject.errorMessage}</p>
              </div>
            </div>
          )}

          <div className="pt-4 px-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-500 hover:text-error hover:bg-error/5 transition-all text-sm font-medium border border-transparent hover:border-error/10"
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
