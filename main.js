import { listen } from "@proxtx/framework";
import config from "@proxtx/config";

await listen(config.port);
console.log("Server running on port:", config.port);
