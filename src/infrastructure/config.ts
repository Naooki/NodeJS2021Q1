import { injectable } from 'inversify';
import dotenv from 'dotenv';

dotenv.config();

@injectable()
export class Config {
  readonly pgConnStr = process.env.PG_CONN_STR as string;
}
