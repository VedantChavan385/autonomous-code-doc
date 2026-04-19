import React, { useState } from 'react';
import { Github, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useProjectStore } from '../../stores/projectStore';

export function AddRepoModal({ isOpen, onClose }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const createProject = useProjectStore((state) => state.createProject);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!repoUrl) {
      toast.error('GitHub URL is required');
      return;
    }

    // Basic GitHub URL validation
    if (!repoUrl.includes('github.com/')) {
      toast.error('Please enter a valid GitHub URL');
      return;
    }

    try {
      setIsLoading(true);
      const name = projectName || repoUrl.split('/').pop();
      await createProject({ 
        name, 
        repoUrl,
        file_extensions: ['.js', '.py', '.jsx', '.tsx', '.ts'] // Default set
      });
      toast.success('Project added! Processing started.');
      setRepoUrl('');
      setProjectName('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Repository">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="GitHub Repository URL"
            placeholder="https://github.com/user/repo"
            icon={Github}
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
          <Input
            label="Project Name (Optional)"
            placeholder="My Cool Project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          
          <div className="bg-white/5 border border-white/5 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Default Extensions</p>
            <div className="flex flex-wrap gap-2">
              {['.js', '.py', '.jsx', '.tsx', '.ts'].map(ext => (
                <span key={ext} className="px-2 py-1 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-3 italic">
              These files will be parsed during ingestion.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            type="button" 
            variant="ghost" 
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            isLoading={isLoading}
          >
            Start Processing
          </Button>
        </div>
      </form>
    </Modal>
  );
}
