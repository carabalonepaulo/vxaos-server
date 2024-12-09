import { Reader, Writer } from "services/listener/buffer.ts";
import { Services } from "services/mod.ts";
import { Packet } from "services/packet_handler/packets/mod.ts";

export class SignUp implements Packet {
  email!: string;
  password!: string;

  serialize(writer: Writer) {}

  deserialize(reader: Reader) {
    this.email = reader.string();
    this.password = reader.string();
  }

  handle(services: Services, id: number) {
    console.log(id, this.email, this.password);
  }
}
