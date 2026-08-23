import React, { useState } from "react";
import { useAuth, DEMO_USERS, User } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Lock, 
  Dna, 
  Key, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User>(DEMO_USERS[1]); // Dr. Jordan Chen, PhD (Bioinformatician) default
  const [password, setPassword] = useState("••••••••••••");
  const [customEmail, setCustomEmail] = useState("");
  const [isInstitutionalLogin, setIsInstitutionalLogin] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInstitutionalLogin && customEmail) {
      login({
        id: "usr-custom-" + Date.now(),
        name: customEmail.split("@")[0].replace(".", " ").toUpperCase(),
        email: customEmail,
        role: "Researcher / Bioinformatician",
        title: "Staff Scientist",
        avatarInitial: "SC"
      });
    } else {
      login(selectedUser);
    }
    navigate("/workspace");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-sans antialiased">
      {/* Restrained Institutional Header bar */}
      <div className="border-b border-border bg-card/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-lg shadow-subtle">
            U
          </div>
          <div>
            <div className="font-serif font-semibold text-base tracking-tight text-foreground leading-tight">
              UC-CCC Transcriptomics
            </div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-sans">
              RNA-seq Scientific Analytics Platform
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-accent" />
          <span>Institutional Single Sign-On (OIDC / InCommon)</span>
        </div>
      </div>

      {/* Centered, Restrained Sign-in Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-subtle p-8 scientific-fade-in">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary border border-primary/20 mb-3">
              <Dna className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-semibold text-foreground tracking-tight">
              Sign In to Analysis Workspace
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-sans">
              Enter your institutional credentials or select an authenticated research persona to access genomic datasets and pipelines.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            {!isInstitutionalLogin ? (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Research Persona
                </Label>
                <div className="space-y-2">
                  {DEMO_USERS.map((u) => {
                    const isSelected = selectedUser.id === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className={`w-full text-left p-3 rounded-md border text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                            : "border-border bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-foreground">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground">{u.title}</div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                    Institutional Email (.edu / .org)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@uchicago.edu"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="mt-1 h-9 text-xs bg-background border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="pass" className="text-xs font-semibold text-foreground">
                    CNetID / InCommon Password
                  </Label>
                  <Input
                    id="pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 h-9 text-xs bg-background border-border"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Authorize & Open Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setIsInstitutionalLogin(!isInstitutionalLogin)}
                className="text-xs text-accent hover:underline font-medium"
              >
                {isInstitutionalLogin
                  ? "← Switch to Demo Research Personas"
                  : "Sign in with Institutional CNetID SSO"}
              </button>
            </div>
          </form>

          {/* Privacy & Safe Harbor Note */}
          <div className="mt-6 pt-5 border-t border-border flex items-start gap-2 text-[11px] text-muted-foreground">
            <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
            <p className="leading-normal">
              Access is governed by the University of Chicago Comprehensive Cancer Center IRB Charter and Data Use Agreement. All session telemetry is cryptographically audited.
            </p>
          </div>
        </div>
      </div>

      {/* Restrained Legal / Governance Footer */}
      <div className="border-t border-border bg-card/40 px-6 py-3 text-center text-[11px] text-muted-foreground font-sans">
        <div>
          © 2026 University of Chicago Comprehensive Cancer Center (UC-CCC). All rights reserved. Proprietary Scientific Analytics System.
        </div>
      </div>
    </div>
  );
};

export default Login;
