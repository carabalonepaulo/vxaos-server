import { Reader, Writer } from "lib/buffer.ts";
import { Services } from "lib/service.ts";
import { Packet, PacketId } from "packets/mod.ts";
import { Database } from "services/database.ts";

export class SignIn implements Packet {
  id = PacketId.Login;
  email!: string;
  password!: string;

  serialize(writer: Writer) {
    writer.byte(this.id);
    writer.string(this.email);
    writer.string(this.password);
  }

  deserialize(reader: Reader) {
    this.id = reader.byte();
    this.email = reader.string();
    this.password = reader.string();
  }

  handle(services: Services, id: number) {
    const database = services.get<Database>("Database")!;
    console.log(id, this.email, this.password);
  }
}
