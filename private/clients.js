import fs from "fs/promises";
import { Client } from "./client.js";

export let clients = {};

export const refreshClients = async () => {
  let client_receivers = await fs.readdir("client_receivers");
  for (let client_receiverName of client_receivers) {
    let client_receiver = await import(
      "../client_receivers/" + client_receiverName + "/main.js"
    );
    let generatedClients = await generateClients(client_receiver);
    clearClients();
    for (let client of generatedClients) {
      clients[client.id] = client;
    }
  }
};

const clearClients = () => {
  for (let clientName of clients) delete clients[clientName];
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

await refreshClients();
