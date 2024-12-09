import { PlaceHolder } from "services/placeholder.ts";
import { Database } from "services/database/service.ts";
import { Listener } from "services/listener/service.ts";
import { PacketHandler } from "services/packet_handler/service.ts";

import { run } from "services/mod.ts";

run(
  new PlaceHolder(),
  new Database(),
  new Listener(5000, 1024),
  new PacketHandler(),
);
