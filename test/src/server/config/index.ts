import { extend } from "lodash";
import { join } from "path";

interface configIn {
  viewDir: string;
  staticDir: string;
  env: string;
  port?: number;
}

let config: configIn = {
  viewDir: join(__dirname, "..", "dist"),
  staticDir: join(__dirname,  "../dist"),
  // staticDir: join(__dirname, "..", "assets"),
  env: process.env.NODE_ENV
};

if (process.env.NODE_ENV == "development") {
  config = extend(config, {
    port: 8081
  });
}

if (!process.env.NODE_ENV || process.env.NODE_ENV == "production") {
  config = extend(config, {
    port: 80
  });
}

export default config;
