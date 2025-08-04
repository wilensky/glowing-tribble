import { range, sleep } from "@/helpers/Util";
import { Database, Operations, Message } from "@/services/Database";
import { Queue } from "@/services/Queue";
import { Worker } from "@/services/Worker";
import logger from "@/services/Logger";
import config from "config";

const {
  ITEMS_NUMBER,
  WORKERS_NUMBER
} = config;

const ITEMS = range(ITEMS_NUMBER).map(item => `item${item}`);

const applyToAll = (queue: Queue, operation: Operations, val: number): void => {
  for (const product of ITEMS) {
    queue.Enqueue(new Message(
      product,
      operation,
      val
    ));
  }
}

const main = async () => {
    logger.info({ num: ITEMS_NUMBER }, 'Number of items');
    logger.info({ num: WORKERS_NUMBER }, 'Number of workers');

    const db = new Database();
    const queue = new Queue(logger);

    applyToAll(queue, Operations.SET, 50);

    for (let i = 0; i < 10; i++) {
      applyToAll(queue, Operations.ADD, i);
    }

    range(WORKERS_NUMBER).forEach(i => {
      const worker = new Worker(i, queue);
      worker.Work(db.set);
    })

    await sleep(2500);

    logger.info({ size: queue.Size() }, 'Queue size');
    logger.info({ state: JSON.stringify(db.state(), null, 2) }, 'DB state');
}

main();
