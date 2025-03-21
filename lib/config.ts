import Config from 'react-native-config';

export interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export const ENV: EnvConfig = {
  SUPABASE_URL: Config.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: Config.SUPABASE_ANON_KEY || '',
};

const validateEnv = () => {
  const missing: string[] = [];

  if (!ENV.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!ENV.SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    console.error(
      `Error: Missing required environment variables: ${missing.join(', ')}`,
    );

    if (__DEV__) {
      console.warn(
        `Missing required environment variables: ${missing.join(', ')}\n` +
          'Make sure you have set up your .env file correctly.',
      );
    }
  }
};

validateEnv();

export default ENV;
