import { apps } from "../private/apps.js";
import { auth } from "./meta.js";

export const execute = async (pwd, appIndex, method, args) => {
  if (!auth(pwd)) return;
  let app = apps[appIndex];
  if (app.definitions?.methods[method]) return await app[method](...args);
};
