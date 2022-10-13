import { apps } from "../private/apps.js";
import { auth } from "./meta.js";
import config from "@proxtx/config";

export const execute = async (pwd, appName, method, args) => {
  if (!auth(pwd)) return;
  let app = apps[appName];
  if (app.definitions?.methods[method]) return await app[method](...args);
};

export const getApps = (pwd) => {
  if (!auth(pwd)) return;
  return config.apps;
};

export const getDefinitions = async (pwd, appName) => {
  if (!auth(pwd)) return;
  let app = apps[appName];
  app.updateDefinitions && (await app.updateDefinitions());
  return app.definitions;
};
