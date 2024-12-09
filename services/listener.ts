import { Service, Services } from "lib/service.ts";

interface Client {
  id: number;
  conn: Deno.TcpConn;
}

export class Listener implements Service {
  private listener: Deno.TcpListener | undefined;
  private clients: (Client | null)[];
  private port: number;
  private shutdown: (() => void) | undefined;
  private running: boolean = false;

  onPacketReceived: ((id: number, buff: Uint8Array) => void) | undefined;

  constructor(port: number, maxClients: number) {
    this.port = port;
    this.clients = Array.from<Client | null>({ length: maxClients }).fill(null);
  }

  start(_: Services, shutdown: () => void) {
    this.running = true;
    this.shutdown = shutdown;
    this.listener = Deno.listen({ port: this.port });
    this.listener.accept()
      .then((conn) => {
        const id = this.clients.indexOf(null);
        if (id == -1) {
          console.log("failed to accept connection, server is full");
          conn.close();
          return;
        }

        const client = { id, conn };
        this.clients[id] = client;
        this.handleConn(client).catch(() => this.disconnect(id));
      })
      .catch(() => {});
  }

  stop() {
    for (const client of this.clients) {
      if (client === null) continue;
      this.disconnect(client.id);
    }

    this.running = false;
    this.listener?.close();
  }

  async send(id: number, buff: Uint8Array): Promise<number> {
    if (this.clients[id] === null) return -1;
    return await this.clients[id].conn.write(buff);
  }

  async sendTo(
    buff: Uint8Array,
    filter: (client: Client) => boolean,
  ): Promise<void> {
    const promises = [];
    for (const client of this.clients) {
      if (client === null) continue;
      if (filter(client) === false) continue;
      promises.push(client.conn.write(buff));
    }
    await Promise.all(promises);
  }

  disconnect(id: number) {
    if (this.clients[id] === null) return;
    this.clients[id].conn.close();
    this.clients[id] = null;
    console.log(`client ${id} disconnected`);
  }

  private async handleConn(client: Client) {
    console.log(`client ${client.id} connected`);
    const buff = new Uint8Array(2048);
    while (this.running) {
      const len = await client.conn.read(buff);
      if (len === null) {
        this.disconnect(client.id);
        return;
      }

      const packetBuf = buff.slice(0, len);
      if (this.onPacketReceived !== undefined) {
        this.onPacketReceived(client.id, packetBuf);
      }
    }
  }
}
