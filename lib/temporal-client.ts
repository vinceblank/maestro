import { Connection, Client } from '@temporalio/client';
import { Worker, NativeConnection } from '@temporalio/worker';
import * as path from 'path';
import * as fs from 'fs';
import { ENV } from 'claude-tempo/config';

const TEMPORAL_ADDRESS = process.env[ENV.TEMPORAL_ADDRESS] ?? 'localhost:7233';
const TEMPORAL_NAMESPACE = process.env[ENV.TEMPORAL_NAMESPACE] ?? 'default';
const TASK_QUEUE = process.env[ENV.TASK_QUEUE] ?? 'claude-tempo';

// Singleton cached on globalThis to survive HMR
declare global {
  // eslint-disable-next-line no-var
  var __temporal_client__: Client | undefined;
  // eslint-disable-next-line no-var
  var __temporal_worker__: Worker | undefined;
}

export async function getTemporalClient(): Promise<Client> {
  if (globalThis.__temporal_client__) {
    return globalThis.__temporal_client__;
  }

  const connection = await Connection.connect({
    address: TEMPORAL_ADDRESS,
  });

  const client = new Client({
    connection,
    namespace: TEMPORAL_NAMESPACE,
  });

  globalThis.__temporal_client__ = client;

  // Auto-start the worker so workflow queries can be served
  ensureWorkerRunning().catch((err) => {
    console.error('[temporal-client] Failed to start worker:', err);
  });

  return client;
}

export function getTaskQueue(): string {
  return TASK_QUEUE;
}

/**
 * Resolve the workflow bundle path. Prefers the bundle shipped with the
 * claude-tempo package, falls back to a local workflow-bundle.js.
 */
function resolveWorkflowBundle(): string {
  // Check local build first
  const localBundle = path.join(process.cwd(), 'workflow-bundle.js');
  if (fs.existsSync(localBundle)) return localBundle;

  // Walk node_modules to find the installed package (no require.resolve — Turbopack rewrites it)
  const candidates = [
    path.join(process.cwd(), 'node_modules', 'claude-tempo', 'workflow-bundle.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  // pnpm stores packages in .pnpm with version suffix — search for it
  const pnpmDir = path.join(process.cwd(), 'node_modules', '.pnpm');
  if (fs.existsSync(pnpmDir)) {
    const entries = fs.readdirSync(pnpmDir).filter(e => e.startsWith('claude-tempo@'));
    for (const entry of entries) {
      const bundlePath = path.join(pnpmDir, entry, 'node_modules', 'claude-tempo', 'workflow-bundle.js');
      if (fs.existsSync(bundlePath)) return bundlePath;
    }
  }

  throw new Error(
    'Workflow bundle not found. Either install claude-tempo or run npm run build:workflows.'
  );
}

export async function ensureWorkerRunning(): Promise<void> {
  if (globalThis.__temporal_worker__) {
    return;
  }

  const bundlePath = resolveWorkflowBundle();

  const connection = await NativeConnection.connect({
    address: TEMPORAL_ADDRESS,
  });

  const worker = await Worker.create({
    connection,
    namespace: TEMPORAL_NAMESPACE,
    taskQueue: TASK_QUEUE,
    workflowBundle: { code: fs.readFileSync(bundlePath, 'utf-8') },
  });

  globalThis.__temporal_worker__ = worker;

  // Run worker in background — don't block the server
  worker.run().catch((err) => {
    console.error('[temporal-worker] Worker stopped:', err);
    globalThis.__temporal_worker__ = undefined;
  });
}
