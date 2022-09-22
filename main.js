import { listen } from "@proxtx/framework";
import config from "@proxtx/config";
import { clients } from "./private/clients.js";
import { apps } from "./private/apps.js";

console.log(clients);

await listen(config.port);
console.log("Server running on port:", config.port);
