/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    clientId?: string;

    croctPreview?: string;
  }
}

interface ImportMetaEnv {
  PUBLIC_CROCT_APP_ID: string;

  CROCT_API_KEY: string;

  CROCT_TIMEOUT?: string;
}
