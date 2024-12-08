import { Service, Services } from "src/service.ts";

export class Database implements Service {
  start(_services: Services, _shutdown: () => void): void {}
  stop(): void {}
}
