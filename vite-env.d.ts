/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HEADCRAB_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
