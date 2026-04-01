"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

type AgentType = 'claude' | 'copilot';

interface RecruitDialogProps {
  onRecruit: (data: {
    name: string;
    workDir: string;
    initialMessage?: string;
    agent?: AgentType;
  }) => Promise<void>;
  defaultWorkDir?: string;
}

export function RecruitDialog({ onRecruit, defaultWorkDir }: RecruitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [workDir, setWorkDir] = useState(defaultWorkDir ?? "");
  const [agent, setAgent] = useState<AgentType>("claude");

  useEffect(() => {
    if (defaultWorkDir && !workDir) {
      setWorkDir(defaultWorkDir);
    }
  }, [defaultWorkDir]); // eslint-disable-line react-hooks/exhaustive-deps
  const [initialMessage, setInitialMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !workDir.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onRecruit({
        name: name.trim(),
        workDir: workDir.trim(),
        initialMessage: initialMessage.trim() || undefined,
        agent,
      });
      setName("");
      setWorkDir("");
      setInitialMessage("");
      setAgent("claude");
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }, [name, workDir, initialMessage, agent, submitting, onRecruit]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline" className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            Recruit
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recruit a new player</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="recruit-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="recruit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. test-runner"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="recruit-agent" className="text-sm font-medium">
              Agent
            </label>
            <select
              id="recruit-agent"
              value={agent}
              onChange={(e) => setAgent(e.target.value as AgentType)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="claude">Claude Code</option>
              <option value="copilot">GitHub Copilot</option>
            </select>
            {agent === "copilot" && (
              <p className="text-xs text-muted-foreground">
                Copilot sessions are headless — monitor via dashboard
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="recruit-workdir" className="text-sm font-medium">
              Working Directory
            </label>
            <Input
              id="recruit-workdir"
              value={workDir}
              onChange={(e) => setWorkDir(e.target.value)}
              placeholder="e.g. C:\repos\my-project"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="recruit-message" className="text-sm font-medium">
              Initial Message <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="recruit-message"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="What should this player do?"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !workDir.trim() || submitting}
            className="w-full"
          >
            {submitting ? "Recruiting..." : "Recruit Player"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
