declare const LEVEL: unique symbol;
declare const MESSAGE: unique symbol;
declare const SPLAT: unique symbol;

declare const configs: Configs;

export interface Config {
  readonly levels: { [k: string]: number };
  readonly colors: { [k: string]: string };
}

export interface Configs {
  readonly cli: Config;
  readonly npm: Config;
  readonly syslog: Config;
}

export interface TransformableInfo {
  level: string;
  message: any;
  [LEVEL]?: string;
  [MESSAGE]?: any;
  [SPLAT]?: any;
  [key: string | symbol]: any;
}

export { LEVEL, MESSAGE, SPLAT, configs };
