import { Entity } from './Entity';

export class User extends Entity {
  constructor(
    public login: string,
    public password: string,
    public age: number,
  ) {
    super();
  }
}
