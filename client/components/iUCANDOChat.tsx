import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  Bot,
  User,
  Loader2,
  Layers,
  Dna,
  Users,
  Stethoscope,
  FileText,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  GitPullRequest,
  ImageIcon,
  ShieldCheck,
  Globe,
  BarChart3,
  Network
} from "lucide-react";
import { toast } from "sonner";

interface iUCANDOChatProps {
  isOpen: boolean;
  onClose: () => void;
  patientContext?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  quickActions?: { label: string; path: string }[];
}

export function IUCANDOChat({ isOpen, onClose, patientContext }: iUCANDOChatProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"text" | "voice" | "both">("both");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello, I am the iUCANDO Platform-Aware Research Concierge. I have live knowledge of all datasets, active clinical trials, omics tools, and patient records across this platform. How can I help you find a cohort, recommend a clinical trial, or structure a study protocol today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: "Suggest Study Protocol", path: "#protocol" },
        { label: "Match Clinical Trials", path: "/trial-matching" },
        { label: "Explore Cohorts", path: "/cohort-builder" },
        { label: "Patient Integration", path: "/patient-integration" },
        { label: "iUCADO-Orbit Engine", path: "/iucado-orbit" },
        { label: "RNA-seq Workspace", path: "/workspace" }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setSpeechError("Voice input isn't supported in this browser — switching to text");
      if (mode === "voice") {
        setMode("text");
      }
    } else {
      setVoiceSupported(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_\[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const parseQuickActions = (replyText: string) => {
    const actions: { label: string; path: string }[] = [];
    const lower = replyText.toLowerCase();

    // Map named tools to direct routes
    if (lower.includes("trial matching") || lower.includes("/trial-matching")) {
      actions.push({ label: "Open Trial Matching", path: "/trial-matching" });
    }
    if (lower.includes("cohort builder") || lower.includes("/cohort-builder")) {
      actions.push({ label: "Open Cohort Builder", path: "/cohort-builder" });
    }
    if (lower.includes("patient integration") || lower.includes("/patient-integration")) {
      actions.push({ label: "Open Patient Integration", path: "/patient-integration" });
    }
    if (lower.includes("patient 360") || lower.includes("/patient-360")) {
      actions.push({ label: "Open Patient 360 Orbit", path: "/patient-360" });
    }
    if (lower.includes("rna-seq") || lower.includes("workspace") || lower.includes("/workspace") || lower.includes("deseq2")) {
      actions.push({ label: "Launch RNA-seq Workspace", path: "/workspace" });
    }
    if (lower.includes("gsea") || lower.includes("pathway") || lower.includes("/pathways/gsea")) {
      actions.push({ label: "Open GSEA Pathways", path: "/pathways/gsea" });
    }
    if (lower.includes("omics view") || lower.includes("/omics-view") || lower.includes("phoenixmo")) {
      actions.push({ label: "Open Omics View", path: "/omics-view" });
    }
    if (lower.includes("imaging") || lower.includes("ohif") || lower.includes("dicom") || lower.includes("/imaging-hub")) {
      actions.push({ label: "Launch Imaging Hub (OHIF)", path: "/imaging-hub" });
    }
    if (lower.includes("consent") || lower.includes("/consent-console")) {
      actions.push({ label: "Consent Console", path: "/consent-console" });
    }
    if (lower.includes("orbit") || lower.includes("/iucado-orbit")) {
      actions.push({ label: "Launch iUCADO-Orbit", path: "/iucado-orbit" });
    }
    if (lower.includes("global integrations") || lower.includes("/global-integrations")) {
      actions.push({ label: "Global Integrations", path: "/global-integrations" });
    }
    if (lower.includes("governance") || lower.includes("/governance")) {
      actions.push({ label: "Governance & IRB", path: "/governance" });
    }
    if (lower.includes("data ingestion") || lower.includes("/data/upload")) {
      actions.push({ label: "Data Ingestion", path: "/data/upload" });
    }

    // Deduplicate by path
    const seen = new Set<string>();
    const unique = actions.filter(a => {
      if (seen.has(a.path)) return false;
      seen.add(a.path);
      return true;
    });

    return unique.slice(0, 4);
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);
    setSpeechError(null);

    try {
      const res = await fetch("/api/beacon/gemini-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          patientContext: patientContext || "UC-CCC-89421 Stage IIIB Breast Cancer with BRCA1 and PD-L1 CPS 12"
        })
      });

      const data = await res.json();
      const aiReply = data.response || "No response received from model.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: parseQuickActions(aiReply)
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (mode === "voice" || mode === "both") {
        speakText(aiReply);
      }
    } catch (err) {
      console.error("iUCANDO API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "I encountered an error connecting to the intelligence server. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceRecognition = () => {
    if (!voiceSupported) {
      setSpeechError("Voice input isn't supported in this browser — switching to text");
      setMode("text");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          handleSend(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone permission denied. Please allow microphone access.");
        } else if (event.error === "no-speech") {
          setSpeechError("No speech detected. Please try speaking again.");
        } else {
          setSpeechError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Failed to start SpeechRecognition:", e);
      setIsListening(false);
      setSpeechError("Could not activate microphone.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-card h-full border-l border-border shadow-elevated flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif font-bold text-base text-foreground">iUCANDO AI</h2>
                <Badge variant="outline" className="text-[9px] border-primary/40 bg-primary/10 text-primary px-1.5 py-0 font-mono font-bold">
                  Platform-Aware Concierge
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-sans">
                Cross-Platform Oncology & Study Protocol Intelligence
              </p>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Permanent Clinical Disclaimer */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-tight">
            iUCANDO recommendations are based on platform data, not a substitute for clinical judgment or a systematic literature review.
          </span>
        </div>

        {/* Mode Selector */}
        <div className="p-2 border-b border-border bg-surface/60 flex items-center justify-between px-4">
          <div className="flex items-center gap-1 text-xs">
            {(["text", "voice", "both"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  if (m !== "text" && !voiceSupported) {
                    setSpeechError("Voice input isn't supported in this browser — switching to text");
                    setMode("text");
                    return;
                  }
                  setMode(m);
                  setSpeechError(null);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow-subtle"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-[9px] font-mono border-border text-muted-foreground">
              Platform Connected
            </Badge>
          </div>
        </div>

        {/* Inline Speech Error Message */}
        {speechError && (
          <div className="px-4 py-1.5 bg-destructive/10 border-b border-destructive/20 text-[11px] text-destructive flex items-center justify-between">
            <span>{speechError}</span>
            <button onClick={() => setSpeechError(null)} className="text-destructive hover:opacity-80">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-surface text-primary border border-border"
                }`}
              >
                {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-medium shadow-subtle"
                    : "bg-surface border border-border text-foreground shadow-subtle space-y-2"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Direct Action Recommendation Buttons */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1.5">
                    {msg.quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (action.path === "#protocol") {
                            handleSend("Suggest a multi-modal translational research study protocol combining Cohort Builder, RNA-seq DESeq2, and iUCADO-Orbit evidence");
                          } else {
                            onClose();
                            navigate(action.path);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-card hover:bg-muted text-[11px] font-semibold text-primary border border-border shadow-subtle transition-all"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3 h-3 text-accent" />
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] mt-1 text-right font-mono ${
                  msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-surface text-primary border border-border flex items-center justify-center text-xs shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Research Concierge is querying platform tools & clinical records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompt Chips */}
        <div className="px-3 py-2 bg-surface/40 border-t border-border flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleSend("Suggest a multi-modal study protocol with cohort selection and omics tools")}
            className="text-[10px] px-2.5 py-1 rounded-full bg-card border border-border hover:bg-muted text-foreground shrink-0 font-medium transition-colors"
          >
            📋 Build Study Protocol
          </button>
          <button
            onClick={() => handleSend("Which active clinical trials in Trial Matching match BRCA1 or EGFR mutations?")}
            className="text-[10px] px-2.5 py-1 rounded-full bg-card border border-border hover:bg-muted text-foreground shrink-0 font-medium transition-colors"
          >
            🎯 Match Clinical Trials
          </button>
          <button
            onClick={() => handleSend("How can I filter patients by stage and pathogenic mutations in Cohort Builder?")}
            className="text-[10px] px-2.5 py-1 rounded-full bg-card border border-border hover:bg-muted text-foreground shrink-0 font-medium transition-colors"
          >
            👥 Cohort Builder
          </button>
          <button
            onClick={() => handleSend("How do I configure DESeq2 design formulas and batch correction in Workspace?")}
            className="text-[10px] px-2.5 py-1 rounded-full bg-card border border-border hover:bg-muted text-foreground shrink-0 font-medium transition-colors"
          >
            🧬 RNA-seq & DESeq2
          </button>
          <button
            onClick={() => handleSend("Explain Patient Integration, RECIST 1.1 tracking, and DeepSurv survival prediction")}
            className="text-[10px] px-2.5 py-1 rounded-full bg-card border border-border hover:bg-muted text-foreground shrink-0 font-medium transition-colors"
          >
            🩺 Patient Integration
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-border bg-card space-y-2">
          <div className="flex items-center gap-2">
            {(mode === "voice" || mode === "both") && voiceSupported && (
              <Button
                size="icon"
                type="button"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleVoiceRecognition}
                className="h-9 w-9 shrink-0 border-border"
              >
                {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4 text-primary" />}
              </Button>
            )}

            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask research concierge about trials, cohorts, omics..."
              className="text-xs h-9 bg-surface border-border"
            />

            <Button
              size="icon"
              disabled={loading || !inputText.trim()}
              onClick={() => handleSend()}
              className="h-9 w-9 shrink-0 bg-primary text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
