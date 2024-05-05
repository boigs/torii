interface Configuration {
  environment: Environment;
  headcrabHttpBaseUrl: string;
  headcrabWsBaseUrl: string;
}

enum Environment {
  DEV = 'dev',
  PROD = 'prod',
}

const getEnvironment: () => Environment = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return Environment.DEV;
    case 'production':
      return Environment.PROD;
    default:
      throw new Error('Environment not set.');
  }
};

const getHeadcrabBaseUrl: () => string = () => {
  const headcrabBaseUrl = process.env.NEXT_PUBLIC_HEADCRAB_BASE_URL;
  if (typeof headcrabBaseUrl === 'undefined') {
    throw new Error('Headcrab base url not set.');
  }

  return headcrabBaseUrl;
};

const getConfig: () => Configuration = () => {
  const environment: Environment = getEnvironment();
  const headcrabBaseUrl: string = getHeadcrabBaseUrl();

  const httpProtocol = environment === Environment.DEV ? 'http' : 'https';
  const wsProtocol = environment === Environment.DEV ? 'ws' : 'wss';

  return {
    environment,
    headcrabHttpBaseUrl: `${httpProtocol}://${headcrabBaseUrl}`,
    headcrabWsBaseUrl: `${wsProtocol}://${headcrabBaseUrl}`,
  };
};

const config: Configuration = getConfig();

export { Environment };
export type { Configuration };
export default config;
