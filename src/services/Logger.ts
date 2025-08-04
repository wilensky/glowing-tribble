import pino from "pino";
import config from "@/config"

const version = config.VERSION;

const logger = pino().child({ version });

export default logger;
