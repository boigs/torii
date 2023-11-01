import pino from 'pino';

import config, { Environment } from 'src/config';

const logger = pino({
  browser: { asObject: true },
  level: config.environment === Environment.DEV ? 'debug' : 'info',
});

export default logger;
