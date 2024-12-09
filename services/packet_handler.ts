import { Listener } from "services/listener.ts";
import { Reader } from "lib/buffer.ts";
import { Packets } from "packets/mod.ts";
import { Service, Services } from "lib/service.ts";

export class PacketHandler implements Service {
  depends = ["Database", "Listener"];

  start(services: Services, _: () => void): void {
    const listener = services.get<Listener>("Listener")!;
    listener.onPacketReceived = (id, buf) =>
      this.onPacketReceived(services, id, buf);
  }

  onPacketReceived(services: Services, id: number, buf: Uint8Array) {
    const packetId = buf[0];
    const reader = new Reader(buf);
    if (!(packetId in Packets)) {
      console.log("invalid packet id");
      return;
    }

    const packet = Packets[packetId]();
    packet.deserialize(reader);
    packet.handle(services, id);
  }
}
