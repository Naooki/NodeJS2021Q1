import * as crypto from 'crypto';
import * as faker from 'faker';

import { User } from './User';

export async function hash(password: string) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

export async function verify(password: string, hash: string) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

export function initMockUsers(amount: number): User[] {
  return new Array(amount).fill(null).map(() => ({
    id: faker.random.uuid(),
    login: faker.internet.userName(),
    password: faker.internet.password(),
    age: faker.random.number({ min: 4, max: 130 }),
    isDeleted: false,
  }));
}
