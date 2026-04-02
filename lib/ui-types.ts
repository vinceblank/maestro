// Shared types safe for client components.
// Server-only types live in tempo-types.ts; this file is for types needed by
// both server and client code without pulling in server-only modules.

export type AgentType = 'claude' | 'copilot';
