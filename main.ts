import { PlaceHolder } from "services/placeholder.ts";
import { Database } from "services/database/service.ts";
import { Listener } from "services/listener.ts";
import { PacketHandler } from "services/packet_handler.ts";

import { run } from "lib/service.ts";

run(
  new PlaceHolder(),
  new Database(),
  new Listener(5000, 1024),
  new PacketHandler(),
);
