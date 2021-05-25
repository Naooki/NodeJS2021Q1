import { injectable } from 'inversify';
import dotenv from 'dotenv';

dotenv.config();

@injectable()
export class Config {
  readonly logLevel = process.env.DEBUG ? 'debug' : 'info';
  readonly pgConnStr = process.env.PG_CONN_STR as string;
}
