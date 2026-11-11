/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYABLE_MERCHANT_KEY?: string;
  readonly VITE_PAYABLE_MERCHANT_TOKEN?: string;
  readonly VITE_PAYABLE_TEST_MODE?: string;
  readonly VITE_PAYABLE_LOGO_URL?: string;
  readonly VITE_PAYABLE_NOTIFY_URL?: string;
  readonly VITE_PAYABLE_RETURN_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
