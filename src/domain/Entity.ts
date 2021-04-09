import faker from 'faker';

export class Entity {
  private _id: string;
  isDeleted = false;

  constructor() {
    this._id = faker.random.uuid();
  }

  get id() {
    return this._id;
  }
}
