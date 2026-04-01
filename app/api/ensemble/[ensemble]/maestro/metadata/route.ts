import { NextResponse } from 'next/server';
import { getTemporalClient } from '@/lib/temporal-client';
import { sessionWorkflowId } from 'claude-tempo/config';
import { getMetadataQuery } from 'claude-tempo/signals';
import type { SessionMetadata } from 'claude-tempo/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ensemble: string }> },
) {
  const { ensemble } = await params;
  try {
    const client = await getTemporalClient();
    const handle = client.workflow.getHandle(sessionWorkflowId(ensemble, 'maestro'));
    const metadata = await handle.query(getMetadataQuery) as SessionMetadata;
    return NextResponse.json(metadata);
  } catch {
    return NextResponse.json(null, { status: 404 });
  }
}
