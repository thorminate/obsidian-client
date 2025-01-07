import { API } from "../electron/preload/preload";
export {};

declare global {
  interface Window {
    api: typeof API;
  }
}
