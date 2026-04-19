import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  FileCode, 
  RefreshCw, 
  Code2, 
  Copy,
  Terminal,
  FunctionSquare,
  Box
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import toast from 'react-hot-toast';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { FileTree } from '../components/docs/FileTree';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useProjectStore } from '../stores/projectStore';
import { projectApi } from '../api/project.api';
import { cn } from '../utils/cn';

export default function DocsPage() {
  const { id } = useParams();
  const [activeFile, setActiveFile] = useState(null);
  const [docsData, setDocsData] = useState({});
  const [treeData, setTreeData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedProject, fetchProject } = useProjectStore();

  useEffect(() => {
    const loadDocs = async (projectId) => {
      setIsLoading(true);
      try {
        const data = await projectApi.getDocs(projectId);
        setDocsData(data.docs || {});
        setTreeData(data.tree || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject(id);
      loadDocs(id);
    }
  }, [id, fetchProject]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await projectApi.generateDocs(id);
      setDocsData(data.docs || {});
      setTreeData(data.tree || []);
      setActiveFile(null);
      toast.success('Documentation generated successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate documentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDoc = activeFile ? docsData[activeFile] : null;

  if (!selectedProject) {
    return (
      <div className="h-screen bg-[#0a0a14] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            to={`/projects/${id}`} 
            className="flex items-center text-slate-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Code Documentation</h1>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRegenerate} 
          isLoading={isGenerating}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
          Regenerate Docs
        </Button>
      </div>

      <div className="flex gap-8 items-start">
        {/* Sidebar: File Tree */}
        <aside className="w-72 sticky top-24">
          <Card className="p-4 bg-slate-900/30 border-white/5">
            <FileTree 
              tree={treeData}
              activeFile={activeFile} 
              onFileSelect={setActiveFile} 
            />
          </Card>
        </aside>

        {/* Main: Documentation Content */}
        <main className="flex-1 min-w-0 pb-20">
          <Card className="p-0 overflow-hidden border-white/10 shadow-2xl">
            {/* Header / Breadcrumb */}
            <div className="bg-white/[0.03] px-8 py-4 border-b border-white/5 flex items-center gap-3">
              <FileCode className="h-5 w-5 text-accent-end" />
              <div className="flex items-center text-sm font-mono text-slate-400">
                <span className="text-white font-bold">{activeFile || 'No file selected'}</span>
              </div>
            </div>

            {activeFile && currentDoc ? (
            <div className="p-10">
              {/* Module Summary */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Box className="h-6 w-6 text-accent-start" />
                  Module Overview
                </h2>
                <div className="prose prose-invert prose-slate max-w-none text-slate-400 leading-relaxed">
                  <ReactMarkdown>{currentDoc?.summary || 'No summary available.'}</ReactMarkdown>
                </div>
              </section>

              {/* Functions Documentation */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FunctionSquare className="h-6 w-6 text-blue-500" />
                  Defined Functions
                </h2>
                
                <div className="space-y-6">
                  {currentDoc?.functions && currentDoc.functions.length > 0 ? currentDoc.functions.map((fn, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <code className="text-lg font-bold text-accent-end bg-accent-end/10 px-3 py-1 rounded-lg">
                          {fn.name}({fn.params})
                        </code>
                      </div>
                      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        {fn.description}
                      </p>
                      
                      {fn.code && fn.code.trim() !== "" && (
                        <div className="bg-[#0f0f1a] rounded-xl overflow-hidden border border-white/5">
                           <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Terminal className="h-3 w-3 text-slate-500" />
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Implementation</span>
                              </div>
                              <Copy className="h-3 w-3 text-slate-600 hover:text-slate-400 cursor-pointer" />
                           </div>
                           <SyntaxHighlighter
                              children={fn.code}
                              language="javascript"
                              style={vscDarkPlus}
                              customStyle={{
                                margin: 0,
                                padding: '1.5rem',
                                background: 'transparent',
                                fontSize: '13px',
                              }}
                            />
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-slate-500 italic">No functions extracted.</div>
                  )}
                </div>
              </section>

              {/* Dependencies */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Dependencies</h2>
                <div className="flex flex-wrap gap-2">
                  {currentDoc?.dependencies && currentDoc.dependencies.length > 0 ? (
                    currentDoc.dependencies.map((dep, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs text-slate-400 font-mono">
                        {dep}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No dependencies found.</span>
                  )}
                </div>
              </section>
            </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center justify-center">
                <Box className="h-16 w-16 text-slate-700 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">No Documentation Selected</h3>
                <p className="text-slate-500">
                  {treeData.length === 0 
                    ? "It looks like documentation hasn't been generated yet. Click 'Regenerate Docs' to analyze this repository."
                    : "Select a file from the repository structure on the left to view its documentation."}
                </p>
              </div>
            )}
          </Card>
        </main>
      </div>
    </DashboardLayout>
  );
}


