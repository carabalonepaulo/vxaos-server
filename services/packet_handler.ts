import { Listener } from "services/listener.ts";
import { Reader } from "src/buffer.ts";
import { Packets } from "src/packet.ts";
import { Service, Services } from "src/service.ts";

export class PacketHandler implements Service {
  start(services: Services, _: () => void): void {
    const listener = services.get<Listener>("Listener");
    if (listener === undefined) {
      throw new Error("No Listener service available!");
    }

    listener.onPacketReceived = (id, buf) =>
      this.onPacketReceived(services, id, buf);
  }

  stop(): void {}

  onPacketReceived(services: Services, id: number, buf: Uint8Array) {
    const reader = new Reader(buf);
    const packetId = reader.byte();
    if (!(packetId in Packets)) {
      console.log("invalid packet id");
      return;
    }

    const packet = Packets[packetId]();
    packet.deserialize(reader);
    packet.handle(services, id);
  }
}
