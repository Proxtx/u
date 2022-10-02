import fs from "fs/promises";
import config from "@proxtx/config";

export let apps = [];

export const loadApps = async () => {
  apps = [];
  for (let appInfo of config.apps) {
    let appImport = await import("../apps/" + appInfo.folder + "/main.js");
    let definitions = JSON.parse(
      await fs.readFile("apps/" + appInfo.folder + "/definitions.json", "utf8")
    );
    appImport.App.prototype.definitions = definitions;
    let app = new appImport.App(appInfo.config);
    app.definitions = definitions;
    apps.push(app);
  }
};

await loadApps();
