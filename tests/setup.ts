import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

expect.extend(matchers);

vi.stubEnv('NODE_ENV', 'development');
vi.stubEnv('VITE_PUBLIC_HEADCRAB_BASE_URL', 'headcrab-base-url');

afterEach(() => {
  cleanup();
});
