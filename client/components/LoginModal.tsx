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
    toast.success(`Authenticated as ${personaToLogin.name} (${personaToLogin.role})`);
    onOpenChange(false);
  };

  const handleSwitchUser = (persona: User) => {
    switchUser(persona);
    toast.success(`Switched active context to ${persona.name}`);
    onOpenChange(false);
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out of session");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-lg shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold font-serif text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            {isAuthenticated ? "Select Active User Persona" : "Research & Clinical Authentication"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select a verified clinical, translational research, or governance role to access protected UCANDO data commons modules.
            <span className="block text-[11px] text-amber-700 dark:text-amber-400 font-mono mt-1">
              Demonstration Mode — Select any persona below to simulate role-based access control.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {isAuthenticated && user && (
            <div className="p-3 rounded-xl bg-surface border border-accent/40 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-accent font-mono uppercase block">Active Session</span>
                <p className="font-bold text-foreground">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">{user.title}</p>
              </div>
              <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px]">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active
              </Badge>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
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
                        ? "bg-surface border-accent shadow-subtle"
                        : isSelected
                        ? "bg-muted border-primary"
                        : "bg-card border-border hover:border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg border ${
                          isCurrentActive
                            ? "bg-accent/15 border-accent/40 text-accent"
                            : "bg-surface border-border text-muted-foreground"
                        }`}
                      >
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{persona.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border text-muted-foreground font-mono">
                            {persona.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{persona.title}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{persona.email}</p>
                      </div>
                    </div>
                    {isCurrentActive && (
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Log Out Current Session
              </Button>
            ) : (
              <div />
            )}

            {!isAuthenticated && (
              <Button
                size="sm"
                onClick={() => handleLogin(selectedPersona)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-subtle ml-auto font-semibold"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" /> Authenticate as {selectedPersona.name.split(" ")[0]}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
