import { Repository } from "services/database/repository.ts";

export class Account extends Repository {
  async match(user: string, password: string): Promise<boolean> {
    const [ok] = await this.db.first<[number]>(
      "select 1 from users where name = ? and password = ? limit 1;",
    );
    return ok == 1;
  }
}
