import { Reader, Writer } from "../buffer.ts";
import { Packet } from "../packet.ts";
import { Services } from "../service.ts";

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
