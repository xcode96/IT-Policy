export interface Policy {
  id: number;
  name: string;
}

export type SyncStatus = 'not-connected' | 'connecting' | 'connected' | 'failed';
