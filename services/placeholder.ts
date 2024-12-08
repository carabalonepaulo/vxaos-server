import { Service, Services } from "src/service.ts";

export class PlaceHolder implements Service {
  private cancel: number | undefined;

  start(_services: Services, _: () => void): void {
    this.cancel = setInterval(() => {}, 0);
  }

  stop(): void {
    clearInterval(this.cancel);
  }
}
