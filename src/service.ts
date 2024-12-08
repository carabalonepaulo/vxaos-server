export class Services {
  private services: Record<string, Service>;

  constructor(services: Service[]) {
    this.services = {};
    services.forEach((s) => this.services[s.constructor.name] = s);
  }

  get<T extends Service>(name: string): T | undefined {
    if (!(name in this.services)) return undefined;
    return this.services[name] as T;
  }
}

export interface Service {
  start(services: Services, shutdown: () => void): void;
  stop(): void;
}

export function run(...services: Service[]) {
  const servicesHelper = new Services(services);

  const shutdown = () =>
    services.reverse().forEach((s) => {
      s.stop();
      console.log(`Service ${s.constructor.name} stopped!`);
    });

  services.forEach((s) => {
    s.start(servicesHelper, shutdown);
    console.log(`Service ${s.constructor.name} started!`);
  });

  Deno.addSignalListener("SIGINT", shutdown);
}
