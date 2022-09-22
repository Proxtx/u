import fs from "fs/promises";
import config from "@proxtx/config";

export let apps = [];

export const loadApps = async () => {
  apps = [];
  for (let appInfo of config.apps) {
    let appImport = await import("../apps/" + appInfo.folder + "/main.js");
    apps.push(new appImport.App(appInfo.config));
  }
};

await loadApps();
