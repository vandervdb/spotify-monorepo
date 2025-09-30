export interface QueueStore {
  readonly queue: any;

  loadQueue: Promise<void>;
  getQueue: () => void;
}
