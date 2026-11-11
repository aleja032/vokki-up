import { STORAGE_PREFIX, STORAGE_VERSION } from '../storage/browser-storage';

export const THEME_STORAGE_KEY = 'settings/theme';

const STORED_THEME_KEY = `${STORAGE_PREFIX}:${THEME_STORAGE_KEY}`;

// Runs before hydration so every page, not only Settings, starts with the
// saved theme. "system" (or nothing stored) leaves prefers-color-scheme alone.
export const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem(${JSON.stringify(STORED_THEME_KEY)});if(!raw)return;var stored=JSON.parse(raw);if(stored&&stored.version===${STORAGE_VERSION}&&(stored.value==='light'||stored.value==='dark')){document.documentElement.dataset.theme=stored.value;}}catch(error){}})();`;
