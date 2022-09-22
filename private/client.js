import config from "@proxtx/config";

export class Client {
  id;
  transmitter;
  authenticated = false;
  constructor(transmitter) {
    this.transmitter = transmitter;
    this.id = this.transmitter.id;
    this.clientConfiguration = config.clients[this.id];
  }

  /**
   * Sends a request to a client service
   * @param {String} service service name
   * @param {Object} data the data to send to the service or name of the export if args is provided
   * @param {Object[]} args only if the service follows the export arguments pattern. list of serializable js objects
   */
  async request(service, data, args) {
    if (args) {
      data = {
        export: data,
        arguments: args,
      };
    }

    this.transmitter.request({
      service,
      auth: config.auth,
      id: genId(),
      data,
    });
  }

  async authenticate() {
    let result = await this.transmitter.request({
      service: "core",
      auth: config.auth,
      id: genId(),
      data: {
        export: "key",
        arguments: [],
      },
    });

    if (result.result == this.clientConfiguration.key) {
      this.authenticated = true;
      return true;
    }

    return false;
  }
}

const genId = () => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
