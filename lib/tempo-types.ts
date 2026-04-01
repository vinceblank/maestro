// Re-export types from the claude-tempo package.
// These are kept as inlined interfaces because client components import them,
// and Turbopack resolves the full claude-tempo package graph (including
// @temporalio/workflow native modules) even for type-only imports, which
// causes dev compilation to hang.
//
// These MUST stay in sync with claude-tempo/types.

export interface SessionMetadata {
  playerId: string;
  ensemble: string;
  hostname: string;
  workDir: string;
  gitRoot?: string;
  gitBranch?: string;
  isConductor: boolean;
}

export interface SessionInput {
  metadata: SessionMetadata;
  part?: string;
  messages?: Message[];
  sentMessages?: SentMessage[];
  commandHistory?: Command[];
  reportHistory?: PlayerReport[];
  autoSummary?: string;
  disableStaleDetection?: boolean;
}

export interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: string;
  delivered: boolean;
}

export interface SentMessage {
  id: string;
  to: string;
  text: string;
  timestamp: string;
}

export interface Command {
  text: string;
  source: string;
  replyTo?: string;
  timestamp: string;
}

export interface PlayerReport {
  playerId: string;
  text: string;
  type: 'result' | 'blocker' | 'question';
  timestamp: string;
}

export interface HistoryEntry {
  type: 'command' | 'report';
  timestamp: string;
  data: Command | PlayerReport;
}
