// Re-export signal and query definitions from the claude-tempo package.
// These use @temporalio/workflow internally — only import in Node.js server code.
export {
  receiveMessageSignal,
  recordSentMessageSignal,
  setPartSignal,
  shutdownSignal,
  markDeliveredSignal,
  setNameSignal,
  getPartQuery,
  getMetadataQuery,
  pendingMessagesQuery,
  allMessagesQuery,
  allSentMessagesQuery,
  commandSignal,
  playerReportSignal,
  historyQuery,
} from 'claude-tempo/signals';
