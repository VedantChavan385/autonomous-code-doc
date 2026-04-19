import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProjectGrid } from '../components/project/ProjectGrid';
import { EmptyState } from '../components/project/EmptyState';
import { AddRepoModal } from '../components/project/AddRepoModal';
import { HeroSection } from '../components/dashboard/HeroSection';
import { FeaturesSection } from '../components/dashboard/FeaturesSection';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useProjectStore } from '../stores/projectStore';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, isLoading, fetchProjects, createProject, searchQuery } = useProjectStore();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleHeroIngest = async (url) => {
    try {
      const name = url.split('/').pop();
      await createProject({ 
        name, 
        repoUrl: url,
        file_extensions: ['.js', '.py', '.jsx', '.tsx', '.ts', '.html', '.css', '.ipynb']
      });
      toast.success('System started! Documentation protocol initiated.');
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to ingest repository');
    }
  };

  return (
    <DashboardLayout hideTitle>
      <div className="-mt-8 space-y-12">
        {/* New Visual Sections */}
        <section className="-mx-8">
          <HeroSection onIngest={handleHeroIngest} />
        </section>
        
        <section className="container mx-auto px-8">
          <FeaturesSection />
        </section>

        {/* Existing Project List Section */}
        <section className="container mx-auto px-8 pb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]">
                <Layers className="h-5 w-5 text-[#1a1a1a]" />
              </div>
              <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tight">Project Registry</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={fetchProjects}
                className="h-12 bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] hover:bg-slate-50"
                disabled={isLoading}
              >
                <RefreshCw className={isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
              </Button>
              <Button onClick={() => setIsModalOpen(true)} className="h-12 shadow-[4px_4px_0_#1a1a1a]">
                <Plus className="mr-2 h-4 w-4" />
                New Repository
              </Button>
            </div>
          </div>

          {isLoading && projects.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <ProjectGrid projects={filteredProjects} />
          ) : (
            <div className="py-8 bg-slate-50 border-2 border-dashed border-[#1a1a1a]/10 rounded-[2.5rem]">
              <EmptyState onAdd={() => setIsModalOpen(true)} />
            </div>
          )}
        </section>
      </div>

      <AddRepoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </DashboardLayout>
  );
}
