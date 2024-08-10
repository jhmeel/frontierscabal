import { CACHEABLE } from "../types";
class IRCache {
  #name: string = "<IRCACHE>";
  Localforage: any;
  lastCached: Record<string, any> = {};

  constructor(localforage: any, config: Record<string, any> = {}) {
    this.Localforage = localforage;
  }

  async restorePreviousSession(type: CACHEABLE) {
    let data;
    try {
      console.info("Restoring session...");
      data = await this.Localforage.getItem(type);
    } catch (err: any) {
      console.error(err.message);
    }
    return JSON.parse(data);
  }

  async save(type: CACHEABLE, payload: Record<string, any>) {
    try {
      if (typeof payload !== "object") {
        console.error("Invalid payload");
        return;
      } else {
        console.info("Saving session...");
        await this.clear(type);

        this.lastCached[payload?.type] = payload;
        const stringifiedPayload = JSON.stringify(payload);

        await this.Localforage.setItem(type, stringifiedPayload);

        return this.lastCached;
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async clear(type: CACHEABLE) {
    try {
      await this.Localforage.removeItem(type);
      this.lastCached = {};
    } catch (err: any) {
      console.error(err.message);
    }
  }
}

export default IRCache;
