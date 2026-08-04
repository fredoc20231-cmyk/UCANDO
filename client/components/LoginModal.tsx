import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogIn, LogOut, Lock } from "lucide-react";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// NOTE: This is a placeholder auth gate for demo purposes.
// Production auth (e.g., OAuth2/OIDC/SAMLP) must replace this before real deployment.

export const LoginModal: React.FC<LoginModalProps> = ({ open, onOpenChange }) => {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleLogin = () => {
    login("dr.vance@demo-cancercenter.org", "Dr. Alex Rivera, MD");
    toast.success("Successfully authenticated as Dr. Alex Rivera, MD");
    onOpenChange(false);
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out of session");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {isAuthenticated ? "Session Active" : "Demo Clinician Authentication"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Placeholder authentication gate for Beacon Clinical & Audit Data Access.
            <span className="block text-[11px] text-amber-300/90 font-mono mt-1">
              No password required — this demo login does not verify identity.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400 uppercase font-mono">Authenticated User</p>
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-xs text-emerald-400 font-mono">{user?.email}</p>
                <p className="text-[11px] text-slate-400">Role: {user?.role}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-800/60 bg-red-950/40 text-red-300 hover:bg-red-900/60 text-xs"
              >
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Protected Clinical Routes</span>
                </div>
                <p className="text-slate-400">
                  Accessing Patient 360, Governance, Dynamic Consent, and Audit Logs requires authentication.
                </p>
              </div>
              <Button
                onClick={handleLogin}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-10"
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign In as Dr. Alex Rivera (Demo)
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
