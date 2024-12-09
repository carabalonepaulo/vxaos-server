import { Message, Result } from "services/database/meta.ts";
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const db = new DB("./test.db");

function handle(message: Message) {
  const action = message.action;
  const stmt = db.prepareQuery(message.sql);

  const result: Result = { action, id: message.id };
  if (action === "all") {
    result.rows = stmt.all(message.params);
  } else if (action === "first") {
    const value = stmt.first(message.params);
    if (value !== undefined) {
      result.rows = [value];
    }
  } else if (action === "exec") {
    stmt.execute(message.params);
  }

  self.postMessage(result);
}

self.onmessage = (e: MessageEvent<unknown>) => {
  const message = e.data as Message;
  console.log(message);
  try {
    handle(message);
  } catch (err) {
    self.postMessage({ action: message.action, id: message.id, failed: err });
  }
};
