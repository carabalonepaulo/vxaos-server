import { Service, Services } from "services/mod.ts";

export class PlaceHolder implements Service {
  private cancel: number | undefined;

  start(_services: Services, _: () => void): void {
    this.cancel = setInterval(() => {}, 0);
  }

  stop(): void {
    clearInterval(this.cancel);
  }
}
