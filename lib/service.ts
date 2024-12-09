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
  depends?: string[];
  start?(services: Services, shutdown: () => void): void;
  stop?(): void;
}

export function run(...services: Service[]) {
  const servicesHelper = new Services(services);
  const names = services.map((s) => s.constructor.name);

  const shutdown = () =>
    services.reverse().forEach((s) => {
      if (s.stop !== undefined) s.stop();
      console.log(`Service ${s.constructor.name} stopped!`);
    });

  for (const s of services) {
    if (s.depends === undefined) continue;
    for (const dep of s.depends) {
      if (names.indexOf(dep) !== -1) continue;
      throw new Error(
        `Service '${s.constructor.name}' missing dependency '${dep}'.`,
      );
    }
  }

  services.forEach((s) => {
    if (s.start !== undefined) s.start(servicesHelper, shutdown);
    console.log(`Service ${s.constructor.name} started!`);
  });

  Deno.addSignalListener("SIGINT", shutdown);
}
