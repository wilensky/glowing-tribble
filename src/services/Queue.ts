import { Message, Operations } from "./Database";
import logger from "./Logger";

type Logger = typeof logger;

export class Queue {
    private logger: Logger;

    /** Map of qeueue messages */
    private messages: Map<Message['id'], Message>;

    /** Map of currently running jobs with correspondent group relation */
    private reserved: Map<Message['id'], Message['key']>;

    /** Set of currently processing groups */
    private reservedGroups: Set<Message['key']>;

    /** Finished jobs ids */
    private confirmed: Set<string>;

    constructor(logger: Logger) {
        this.logger = logger;

        this.messages = new Map();
        this.reserved = new Map();
        this.reservedGroups = new Set();
        this.confirmed = new Set();
    }

    private getLogger(extra: Record<string, string | number> = {}) {
      return Object.entries(extra).length === 0 ? this.logger : this.logger.child(extra);
    }

    private markReserved(msg: Message, wid: number): Message {
        const { id, key } = msg;
        const logger = this.getLogger().child({ id, key, wid });

        if (this.reserved.has(key)) {
            logger.error('Job already reserved');
            // Raising an error if by any chance we were able to reserve same job twice
            throw new Error('Job for this key is already reserved');
        }

        // Removing message from the queue to avoid useless hits
        this.messages.delete(id);

        // Announcing message as reserved
        this.reserved.set(id, key);
        this.reservedGroups.add(key);

        logger.info('Reserved');

        return msg;
    }

    /**
     * Confirms message complete
     * @param mid Message id
     * @param wid Worker id
     */
    private markConfirmed(mid: string, wid: number): void {
      //NB: Worker id can be used to save job-worker correspondence + in logs
        this.getLogger().info({ id: mid, wid }, 'Job confirmed');

        // Resolving message group without actual message
        const group = this.reserved.get(mid)!;

        this.reserved.delete(mid);
        this.reservedGroups.delete(group);

        this.confirmed.add(mid);
    }

    /**
     * Checks whether given group is currently processing (aka busy)
     * @param group Group identifier
     * @returns
     */
    private isGroupBusy(group: Message['key']): boolean {
        return this.reservedGroups.has(group);
    }

    /**
     * Enqueues message
     * @param message
     */
    public Enqueue(message: Message) {
        const { id } = message;
        this.messages.set(id, message);
        this.getLogger().info({ id }, 'Enqueued')
    }

    /**
     * Returns next available message from queue
     * @param workerId Worker identifier
     * @returns
     */
    public Dequeue(workerId: number): Readonly<Message> | undefined {
        // Checking whether something has left
        if (this.Size() === 0) {
            return;
        }

        // Iteragting queue messages
        for (const msg of this.messages.values()) {
            const { key } = msg;

            // Checking whether group of given message is currently busy
            if (this.isGroupBusy(key)) {
                // Preventing parallel group processing
                continue;
            }

            return this.markReserved(msg, workerId);
        }

        this.getLogger().warn({ wid: workerId }, 'Idling');

        // Issuing idle job if all groups are busy to keep worker alive
        return new Message('__idle__', Operations.ADD, 1);
    }

    /**
     * Confirms processed message
     * @param workerId
     * @param messageId
     */
    public Confirm(workerId: number, messageId: string) {
        this.markConfirmed(messageId, workerId);
    }

    /**
     * Returns current number of messages in the queue
     */
    public Size(): number {
        return this.messages.size;
    }
}

