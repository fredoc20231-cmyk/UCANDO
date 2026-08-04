import React, { useState } from "react";
import { useAuth, DEMO_USERS, User } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, LogIn, LogOut, User as UserIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onOpenChange }) => {
  const { isAuthenticated, user, login, logout, switchUser } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState<User>(user || DEMO_USERS[0]);

  const handleLogin = (personaToLogin: User) => {
    login(personaToLogin);
    toast.success(`Successfully authenticated as ${personaToLogin.name} (${personaToLogin.role})`);
    onOpenChange(false);
  };

  const handleSwitchUser = (persona: User) => {
    switchUser(persona);
    toast.success(`Switched active user context to ${persona.name}`);
    onOpenChange(false);
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out of session");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {isAuthenticated ? "Select Active User Persona" : "Demo Clinician & Researcher Authentication"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Select a verified clinical or research role to access protected Beacon routes.
            <span className="block text-[11px] text-amber-300/90 font-mono mt-1">
              Demo Authentication — Select any persona below to simulate role-based authorization.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Active User Summary */}
          {isAuthenticated && user && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono uppercase block">Active Session</span>
                <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.role}</p>
              </div>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active
              </Badge>
            </div>
          )}

          {/* User Persona Selector Menu */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {isAuthenticated ? "Switch Role / User Context:" : "Choose User Persona to Authenticate:"}
            </label>

            <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {DEMO_USERS.map((persona) => {
                const isCurrentActive = isAuthenticated && user?.id === persona.id;
                const isSelected = selectedPersona.id === persona.id;

                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => {
                      setSelectedPersona(persona);
                      if (isAuthenticated) {
                        handleSwitchUser(persona);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${
                      isCurrentActive
                        ? "bg-slate-50 dark:bg-slate-950 border-emerald-500/80 shadow-md shadow-emerald-950/30"
                        : isSelected
                        ? "bg-slate-100 dark:bg-slate-800/90 border-cyan-500/60"
                        : "bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0 mt-0.5">
                        {persona.avatarInitial}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {persona.name}
                          {isCurrentActive && (
                            <Badge className="bg-emerald-900/80 text-emerald-300 text-[9px] px-1 py-0">
                              Active
                            </Badge>
                          )}
                        </p>
                        <p className="text-[11px] text-cyan-300 font-medium">{persona.role}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{persona.title}</p>
                      </div>
                    </div>

                    {!isAuthenticated && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogin(persona);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold h-7 px-2.5 shrink-0 mt-1"
                      >
                        <LogIn className="w-3 h-3 mr-1" /> Select
                      </Button>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-800/60 bg-red-950/40 text-red-300 hover:bg-red-900/60 text-xs h-9"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" /> Log Out Current Session
              </Button>
            ) : (
              <Button
                onClick={() => handleLogin(selectedPersona)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 shadow-lg shadow-emerald-950/50"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" /> Authenticate as {selectedPersona.name}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
