type Configuration = {
  environment: Environment;
  headcrabBaseUrl: string;
};

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
  let environment: Environment = getEnvironment();
  let headcrabBaseUrl: string = getHeadcrabBaseUrl();

  return {
    environment,
    headcrabBaseUrl,
  };
};

const config: Configuration = getConfig();

export type { Configuration, Environment };

export default config;
