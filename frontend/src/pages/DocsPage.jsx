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
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [activeFile, setActiveFile] = useState('app.js');
  const [docs, setDocs] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedProject, fetchProject } = useProjectStore();

  useEffect(() => {
    if (id) fetchProject(id);
    // In a real app, we would fetch docs for the specific file
    setDocs(MOCK_DOCS);
  }, [id, fetchProject]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

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
                <span className="hover:text-white cursor-pointer transition-colors">src</span>
                <span className="mx-2 text-slate-600">/</span>
                <span className="text-white font-bold">{activeFile}</span>
              </div>
            </div>

            <div className="p-10">
              {/* Module Summary */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Box className="h-6 w-6 text-accent-start" />
                  Module Overview
                </h2>
                <div className="prose prose-invert prose-slate max-w-none text-slate-400 leading-relaxed">
                  <ReactMarkdown>{docs?.summary}</ReactMarkdown>
                </div>
              </section>

              {/* Functions Documentation */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FunctionSquare className="h-6 w-6 text-blue-500" />
                  Defined Functions
                </h2>
                
                <div className="space-y-6">
                  {docs?.functions.map((fn, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <code className="text-lg font-bold text-accent-end bg-accent-end/10 px-3 py-1 rounded-lg">
                          {fn.name}({fn.params})
                        </code>
                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded uppercase font-black text-slate-500 tracking-wider">
                          Exported
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        {fn.description}
                      </p>
                      
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
                    </div>
                  ))}
                </div>
              </section>

              {/* Dependencies */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Imported Dependencies</h2>
                <div className="flex flex-wrap gap-2">
                  {docs?.dependencies.map((dep, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs text-slate-400 font-mono">
                      {dep}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </Card>
        </main>
      </div>
    </DashboardLayout>
  );
}

const MOCK_DOCS = {
  summary: "This module serves as the primary entry point for the application. It initializes the core configuration, sets up global middleware, and connects to the database. It exports the initialized `app` object for server use.",
  dependencies: ["express", "dotenv", "mongoose", "helmet", "cors", "morgan"],
  functions: [
    {
      name: "initializeExpress",
      params: "config",
      description: "Sets up basic Express middleware including security headers via Helmet, JSON parsing, and CORS configuration based on the provided environment config.",
      code: "const initializeExpress = (config) => {\n  const app = express();\n  app.use(helmet());\n  app.use(cors({ origin: config.corsOrigin }));\n  app.use(express.json());\n  return app;\n};"
    },
    {
      name: "connectToDatabase",
      params: "uri",
      description: "Asynchronously establishes a connection to MongoDB using Mongoose. Includes retry logic with exponential backoff if the initial connection fails.",
      code: "async function connectToDatabase(uri) {\n  try {\n    await mongoose.connect(uri);\n    console.log('Successfully connected to DB');\n  } catch (err) {\n    handleConnectionError(err);\n  }\n}"
    }
  ]
};
