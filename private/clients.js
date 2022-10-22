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
  clearClients();
  for (let client_receiver of client_receivers) {
    let generatedClients = await generateClients(client_receiver);
    for (let client of generatedClients) {
      clients[client.id] = client;
    }
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

const transmitterToClient = async (transmitter) => {
  let client = new Client(transmitter);
  if (await client.authenticate()) {
    return client;
  }
};

await importClientReceivers();
await refreshClients();
