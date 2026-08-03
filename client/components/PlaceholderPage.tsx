import { ReactNode } from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  badge: string;
  icon: ReactNode;
  specs: string[];
  previewContent?: ReactNode;
}

export function PlaceholderPage({
  title,
  subtitle,
  badge,
  icon,
  specs,
  previewContent
}: PlaceholderPageProps) {
  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-uchicago-maroon text-white border border-red-700/50 shadow-md">
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">{title}</h1>
                  <Badge variant="outline" className="border-sky-500/40 text-sky-300 bg-sky-950/40 text-[10px]">
                    {badge}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              </div>
            </div>

            <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800/60 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Route Active in Beacon Hub
            </Badge>
          </div>

          {/* Interactive Chat Prompt Suggestion */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">Ready for Generation: </strong>
                Ask Fusion in chat: <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-300 font-mono">"Build out the {title} page"</code> to expand full interactive controls.
              </span>
            </div>
          </div>
        </div>

        {/* Feature Specifications & Preview Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Specifications Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              Architectural Capabilities & Specs
            </h3>

            <ul className="space-y-3 text-xs text-slate-300">
              {specs.map((spec, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Feature Visual Preview Area */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">UI Wireframe & Preview Canvas</span>
                <span className="text-[10px] text-slate-500 font-mono">Builder.io Custom Component Blueprint</span>
              </div>

              {previewContent ? (
                previewContent
              ) : (
                <div className="p-8 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-3">
                  <div className="inline-flex p-3 rounded-xl bg-slate-900 text-slate-400 border border-slate-800">
                    {icon}
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{title} Workspace Shell</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Connected to the central Beacon Kafka event bus and OPA consent engine. Ready for full feature expansion.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
