import 'dotenv/config';
import * as joi from 'joi';

interface IEnv {
  // PORT_TCP_PRODUCT: number;
  // PRODUCTS_TCP_HOST: string;
  PORT: number;
  SERVERS_NATS: string[];
}

const envSchema = joi
  .object<IEnv>({
    // PORT_TCP_PRODUCT: joi.number().port().required(),
    // PRODUCTS_TCP_HOST: joi.string().required(),
    PORT: joi.number().port().required(),
    SERVERS_NATS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  SERVERS_NATS: process.env.SERVERS_NATS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: IEnv = value;

export const envs: IEnv = {
  // PORT_TCP_PRODUCT: envVars.PORT_TCP_PRODUCT,
  // PRODUCTS_TCP_HOST: envVars.PRODUCTS_TCP_HOST,
  PORT: envVars.PORT,
  SERVERS_NATS: envVars.SERVERS_NATS,
};
