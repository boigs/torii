type Config = {
  environment: Environment;
  headcrabBaseUrl: string;
};

enum Environment {
  DEV = 'dev',
  PROD = 'prod',
}

const getConfig: () => Config = () => {
  let environment: Environment;
  switch (process.env.NODE_ENV) {
    case 'development':
      environment = Environment.DEV;
      break;
    case 'production':
      environment = Environment.PROD;
      break;
    default:
      throw new Error('Environment not set.');
  }

  const headcrabBaseUrl = process.env.NEXT_PUBLIC_HEADCRAB_BASE_URL;
  if (typeof headcrabBaseUrl === 'undefined') {
    throw new Error('Headcrab base url not set.');
  }

  return {
    environment,
    headcrabBaseUrl,
  };
};

export type { Config, Environment };

export default getConfig;
