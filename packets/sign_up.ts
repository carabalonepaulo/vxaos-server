import { Reader, Writer } from "lib/buffer.ts";
import { Services } from "lib/service.ts";
import { Packet } from "packets/mod.ts";

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
