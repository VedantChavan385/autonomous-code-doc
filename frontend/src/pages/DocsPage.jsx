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
      <div className="h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8 border-b-2 border-[#1a1a1a] pb-6">
        <div className="flex items-center gap-4">
          <Link 
            to={`/projects/${id}`} 
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-[#1a1a1a]" />
          </Link>
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight">Code Documentation</h1>
        </div>

        <Button 
          onClick={handleRegenerate} 
          isLoading={isGenerating}
          className="shadow-[4px_4px_0_#1a1a1a]"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
          Regenerate Docs
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar: File Tree */}
        <aside className="w-full lg:w-72 lg:sticky lg:top-24">
          <Card className="p-4 bg-white shadow-[4px_4px_0_#1a1a1a]">
            <FileTree 
              tree={treeData}
              activeFile={activeFile} 
              onFileSelect={setActiveFile} 
            />
          </Card>
        </aside>

        {/* Main: Documentation Content */}
        <main className="flex-1 min-w-0 pb-20 w-full">
          <Card className="p-0 overflow-hidden shadow-[4px_4px_0_#1a1a1a] bg-white">
            {/* Header / Breadcrumb */}
            <div className="bg-slate-50 px-8 py-4 border-b-2 border-[#1a1a1a] flex items-center gap-3">
              <FileCode className="h-5 w-5 text-accent-start" />
              <div className="flex items-center text-sm font-black text-[#1a1a1a] uppercase tracking-widest break-all">
                <span>{activeFile || 'No file selected'}</span>
              </div>
            </div>

            {activeFile && currentDoc ? (
            <div className="p-6 md:p-10">
              {/* Module Summary */}
              <section className="mb-12">
                <h2 className="text-3xl font-black text-[#1a1a1a] mb-6 flex items-center gap-3">
                  <Box className="h-8 w-8 text-accent-start" />
                  Module Overview
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed prose-headings:text-[#1a1a1a] prose-strong:text-[#1a1a1a] prose-a:text-accent-start">
                  <ReactMarkdown>{currentDoc?.summary || 'No summary available.'}</ReactMarkdown>
                </div>
              </section>

              {/* Functions Documentation */}
              <section className="mb-12">
                <h2 className="text-3xl font-black text-[#1a1a1a] mb-8 flex items-center gap-3">
                  <FunctionSquare className="h-8 w-8 text-accent-cool" />
                  Defined Functions
                </h2>
                
                <div className="space-y-6">
                  {currentDoc?.functions && currentDoc.functions.length > 0 ? currentDoc.functions.map((fn, idx) => (
                    <div key={idx} className="bg-white border-2 border-[#1a1a1a] rounded-2xl p-6 hover:shadow-[4px_4px_0_#1a1a1a] transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <code className="text-sm font-black text-[#1a1a1a] bg-accent-cool px-3 py-1.5 border-2 border-[#1a1a1a] rounded-lg">
                          {fn.name}({fn.params})
                        </code>
                      </div>
                      <p className="text-slate-600 font-medium text-sm mb-6 leading-relaxed">
                        {fn.description}
                      </p>
                      
                      {fn.code && fn.code.trim() !== "" && (
                        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] mt-4">
                           <div className="bg-accent-cool px-4 py-2 border-b-2 border-[#1a1a1a] flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-[#1a1a1a]" />
                                <span className="text-[10px] text-[#1a1a1a] uppercase font-black tracking-widest">Implementation</span>
                              </div>
                              <Copy className="h-4 w-4 text-[#1a1a1a] hover:text-slate-500 cursor-pointer transition-colors" />
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
                <h2 className="text-3xl font-black text-[#1a1a1a] mb-6">Dependencies</h2>
                <div className="flex flex-wrap gap-2">
                  {currentDoc?.dependencies && currentDoc.dependencies.length > 0 ? (
                    currentDoc.dependencies.map((dep, idx) => (
                      <span key={idx} className="mono-label px-3 py-1.5 bg-slate-50 border-[1.5px] border-[#1a1a1a] rounded-full text-[10px] text-[#1a1a1a]">
                        {dep}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 font-medium">No dependencies found.</span>
                  )}
                </div>
              </section>
            </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center justify-center bg-slate-50">
                <Box className="h-16 w-16 text-slate-300 mb-6" />
                <h3 className="text-3xl font-black text-[#1a1a1a] mb-2">No Documentation Selected</h3>
                <p className="text-slate-500 font-medium">
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


