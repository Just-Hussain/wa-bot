type Message = import("whatsapp-web.js").Message;
type Client = import("whatsapp-web.js").Client;
type Collection = import("discord.js").Collection;

export type ExtendedClient = Client & { commands: Collection };

export type Data = {
  stats: {
    ping: number;
    [command: str]: number;
  };
};

export type DB = import("lowdb").Low<Data>;

export type Interaction = {
  msg: Message;
  client: Client;
  db: DB;
};
