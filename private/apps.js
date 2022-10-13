import fs from "fs/promises";
import config from "@proxtx/config";

export let apps = {};

export const loadApps = async () => {
  apps = {};
  for (let appName in config.apps) {
    let appConfig = config.apps[appName];
    let appImport = await import("../apps/" + appConfig.folder + "/main.js");
    let definitions = JSON.parse(
      await fs.readFile(
        "apps/" + appConfig.folder + "/definitions.json",
        "utf8"
      )
    );
    appImport.App.prototype.definitions = definitions;
    let appInstance = new appImport.App(appConfig.config);
    appInstance.updateDefinitions && (await appInstance.updateDefinitions());
    apps[appName] = appInstance;
  }
};

await loadApps();
