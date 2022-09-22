import { apps } from "../private/apps.js";
import { auth } from "./meta.js";
import config from "@proxtx/config";

export const execute = async (pwd, appIndex, method, args) => {
  if (!auth(pwd)) return;
  let app = apps[appIndex];
  if (app.definitions?.methods[method]) return await app[method](...args);
};

export const getApps = (pwd) => {
  if (!auth(pwd)) return;
  return config.apps;
};

export const getDefinitions = (pwd, appIndex) => {
  if (!auth(pwd)) return;
  return apps[appIndex]?.definitions;
};
