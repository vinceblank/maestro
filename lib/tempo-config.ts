// Re-export config helpers from the claude-tempo package.
// Consumers throughout the app import from '@/lib/tempo-config' for convenience.
export { sessionWorkflowId, conductorWorkflowId, getConfig } from 'claude-tempo/config';
