import fs from "fs/promises";
import { Client } from "./client.js";
import config from "@proxtx/config";

export let clients = {};

let client_receiverClasses = {};
let client_receivers = [];

const importClientReceivers = async () => {
  let client_receiver_names = await fs.readdir("client_receivers");
  for (let client_receiverName of client_receiver_names) {
    client_receiverClasses[client_receiverName] = (
      await import("../client_receivers/" + client_receiverName + "/main.js")
    ).Receiver;
  }

  for (let client_receiverName in config.client_receivers) {
    for (let receiverConfig of config.client_receivers[client_receiverName])
      client_receivers.push(
        new client_receiverClasses[client_receiverName](receiverConfig)
      );
  }
};

export const refreshClients = async () => {
  let newClients = {};
  for (let client_receiver of client_receivers) {
    let generatedClients = await generateClients(client_receiver);
    for (let client of generatedClients) {
      newClients[client.id] = client;
    }
  }

  clearClients();
  for (let client in newClients) {
    clients[client] = newClients[client];
  }
};

const clearClients = () => {
  for (let clientName in clients) delete clients[clientName];
};

const generateClients = async (client_receiver) => {
  let transmitters = await client_receiver.getTransmitters();
  let clients = [];
  for (let transmitter of transmitters) {
    let client = await transmitterToClient(transmitter);
    if (client) clients.push(client);
  }
  return clients;
};

const clientRefreshLoop = async () => {
  while (true) {
    await refreshClients();
    await new Promise((r) => setTimeout(r, 5 * 60 * 1000));
  }
};

const transmitterToClient = async (transmitter) => {
  let client = new Client(transmitter);
  let auth;
  try {
    auth = await client.authenticate();
  } catch (e) {
    return null;
  }
  if (auth) return client;
  return null;
};

await importClientReceivers();
await refreshClients();
clientRefreshLoop();
