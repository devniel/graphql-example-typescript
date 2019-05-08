import Redis from "ioredis";

export const redis = new Redis({
  host : process.env.REDIS_HOST as string,
  port: Number(process.env.REDIS_PORT) as number,
  db:  Number(process.env.REDIS_DB) as number,
  password: process.env.REDIS_PASSWORD as string,
  tls: (process.env.REDIS_CERT) ? {
    // Refer to `tls.connect()` section in
    // https://nodejs.org/api/tls.html
    // for all supported options
    ca: new Buffer(process.env.REDIS_CERT, 'base64').toString('utf8') as string
  } : undefined
});