import React, { useState, useEffect, useRef } from "react";
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
  Loader2
} from "lucide-react";

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
}

export function IUCANDOChat({ isOpen, onClose, patientContext }: iUCANDOChatProps) {
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
      text: "Hello, I am iUCANDO, powered by iPhoenix-Can. How can I assist with patient records, cohort analysis, or clinical protocol decisions today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
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
          patientContext: patientContext || "UC-CCC-89421 Stage IIIB Breast Cancer"
        })
      });

      const data = await res.json();
      const aiReply = data.response || "No response received from model.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary dark:bg-indigo-950 dark:text-primary border border-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">iUCANDO</h2>
                <Badge variant="outline" className="text-[9px] border-primary/40 bg-primary/10 text-primary px-1.5 py-0 font-mono">
                  v2.4
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Powered by iPhoenix-Can
              </p>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Disclaimer Banner */}
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            iPhoenix-Can is in early access. A dedicated reliability and validation layer for clinical use is in development.
          </span>
        </div>

        {/* Mode Selector */}
        <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex items-center justify-center gap-1">
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
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                mode === m
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {m} Mode
            </button>
          ))}
        </div>

        {/* Inline Speech Error Message */}
        {speechError && (
          <div className="px-4 py-1.5 bg-red-50 dark:bg-red-950/60 border-b border-red-200 dark:border-red-900 text-[11px] text-red-600 dark:text-red-300 flex items-center justify-between">
            <span>{speechError}</span>
            <button onClick={() => setSpeechError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
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
                    ? "bg-primary text-white"
                    : "bg-slate-800 text-cyan-300 border border-slate-700"
                }`}
              >
                {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[82%] text-xs space-y-1 shadow-xs ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div className="text-[9px] opacity-70 text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>iUCANDO is synthesizing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Speech Output Indicator */}
        {speaking && (
          <div className="px-4 py-1.5 bg-sky-50 dark:bg-sky-950/60 border-t border-sky-200 text-sky-700 dark:text-sky-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-sky-500" />
              Speaking response...
            </span>
            <button
              onClick={() => window.speechSynthesis.cancel()}
              className="text-xs underline hover:text-sky-900"
            >
              Stop
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 space-y-2">
          <div className="flex items-center gap-2">
            {(mode === "text" || mode === "both") && (
              <Input
                placeholder="Ask iUCANDO about patients, cohorts, trials..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
                className="text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              />
            )}

            {(mode === "voice" || mode === "both") && (
              <Button
                size="icon"
                onClick={toggleVoiceRecognition}
                variant={isListening ? "destructive" : "outline"}
                className={`h-9 w-9 shrink-0 ${
                  isListening ? "animate-pulse" : "border-slate-300 dark:border-slate-700"
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-primary" />}
              </Button>
            )}

            {(mode === "text" || mode === "both") && (
              <Button
                size="icon"
                onClick={() => handleSend()}
                disabled={loading || !inputText.trim()}
                className="h-9 w-9 bg-primary hover:bg-primary/90 text-white shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
