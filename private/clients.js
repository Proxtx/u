import fs from "fs/promises";
import { Client } from "./client.js";

export let clients = {};

let client_receivers = [];

const importClientReceivers = async () => {
  let client_receiver_names = await fs.readdir("client_receivers");
  for (let client_receiverName of client_receiver_names) {
    client_receivers.push(
      await import("../client_receivers/" + client_receiverName + "/main.js")
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
  let transmitters = client_receiver.transmitters;
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
