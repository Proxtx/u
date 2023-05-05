import * as clients from "../private/clients.js";
import { auth } from "./meta.js";

export const getClients = (pwd) => {
  if (!auth(pwd)) return;
  return Object.keys(clients.clients);
};

export const refreshClients = async (pwd) => {
  if (!auth(pwd)) return;
  await clients.refreshClients();
};

export const request = async (pwd, client, service, data, args) => {
  if (!auth(pwd)) return;
  return await clients.clients[client].request(service, data, args);
};
