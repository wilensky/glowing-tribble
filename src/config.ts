type Config = {
  ITEMS_NUMBER: number;
  WORKERS_NUMBER: number,
  VERSION: string
};

const {
  ITEMS_NUMBER,
  WORKERS_NUMBER
} = process.env;

const config: Config = {
  ITEMS_NUMBER: Number(ITEMS_NUMBER || 3),
  WORKERS_NUMBER: Number(WORKERS_NUMBER || 5),
  VERSION: '0.1.0'
};

export default config;
