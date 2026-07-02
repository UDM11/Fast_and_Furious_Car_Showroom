/// <reference types="vite/client" />

interface AppRuntimeConfig {
	supabaseUrl?: string;
	supabaseAnonKey?: string;
	appUrl?: string;
}

declare global {
	// eslint-disable-next-line no-var
	var __APP_CONFIG__: AppRuntimeConfig | undefined;
}

export {};
