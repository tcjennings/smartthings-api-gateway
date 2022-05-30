export interface MonopriceZone {
  zone: number;
  name: string;
}

export interface MonopriceController {
  controller: number;
  zones: MonopriceZone[];
}

export interface MonopriceConfiguration {
  options?: {
    routes: {
      prefix: string;
    };
  };
  sources: string[];
  controllers: MonopriceController[];
  serial: {
    device: string;
    speed: number;
  };
}

export interface MonopriceZoneState {
  [key: string]: string | undefined;
  UNIT: string | undefined;
  ZONE: string | undefined;
  PR: string | undefined;
  CH: string | undefined;
  VO: string | undefined;
  BS: string | undefined;
  TR: string | undefined;
  BL: string | undefined;
  DT: string | undefined;
  MU: string | undefined;
  LS: string | undefined;
}
