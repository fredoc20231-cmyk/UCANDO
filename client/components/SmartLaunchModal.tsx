import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ExternalLink,
  RotateCw,
  Maximize2,
  Minimize2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  X,
  Globe
} from "lucide-react";

interface SmartLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  platformName?: string;
  targetUrl?: string;
}

export function SmartLaunchModal({
  isOpen,
  onClose,
  patientId = "UC-BEACON-89421",
  platformName = "Cronus Multiomics Platform",
  targetUrl = "https://cronus.life/"
}: SmartLaunchModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [handshakeToken, setHandshakeToken] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Generate a mock SMART-on-FHIR OAuth token for context display
      const randomToken = "eyJhbGciOiJSUzI1NiIs..." + Math.random().toString(36).substring(2, 10);
      setHandshakeToken(randomToken);
      
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleRefresh = () => {
    setLoading(true);
    setIframeKey((prev) => prev + 1);
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`bg-slate-950 border-slate-800 text-white p-0 gap-0 overflow-hidden duration-300 transition-all ${
          isFullscreen
            ? "max-w-[98vw] w-[98vw] h-[94vh] rounded-xl"
            : "max-w-6xl w-[95vw] h-[88vh] rounded-2xl"
        }`}
      >
        {/* Header Toolbar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-base font-bold text-white truncate">
                  SMART Launch: {platformName}
                </DialogTitle>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-950/60 text-[10px] font-mono">
                  <ShieldCheck className="w-3 h-3 mr-1" /> SMART on FHIR v2.0
                </Badge>
                <Badge variant="outline" className="border-sky-500/40 text-sky-300 bg-sky-950/60 text-[10px] font-mono">
                  Patient: {patientId}
                </Badge>
              </div>
              <DialogDescription className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-mono truncate">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Embedded SMART App:</span>
                <span className="text-emerald-300 font-semibold">{targetUrl}</span>
              </DialogDescription>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              className="h-8 text-xs bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Refresh Frame"
            >
              <RotateCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(targetUrl, "_blank")}
              className="h-8 text-xs bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hidden sm:flex"
              title="Open in New Window"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              New Tab
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 text-xs bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Expand Frame"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* OAuth Context Banner */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>OAuth Scopes:</span>
            <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              launch/patient patient/*.read patient/MolecularSequence.read
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[10px]">
            <span>Token: <code className="text-sky-300">{handshakeToken}</code></span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Encrypted Session
            </span>
          </div>
        </div>

        {/* Embedded Frame Viewport */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-3 text-center">
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 animate-bounce">
                <Cpu className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Establishing SMART on FHIR Context...</p>
                <p className="text-xs text-slate-400">Loading {targetUrl} inside secure patient sandbox frame</p>
              </div>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={targetUrl}
            title={`${platformName} - SMART Launch`}
            className="w-full h-full border-0 bg-white"
            allow="camera; microphone; clipboard-write; encrypted-media; fullscreen"
            onLoad={() => setLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
