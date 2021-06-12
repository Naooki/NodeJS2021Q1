import { inject, injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';

import { verify as verifyPassword } from 'src/utils';
import { TOKENS } from 'src/infrastructure/tokens';
import { AuthLoginAttributes } from 'src/interfaces/AuthLoginAttributes';
import { UserService } from './user.service';

@injectable()
export class AuthService {
  private readonly PRIVATE_KEY = 'foobar42';

  constructor(
    @inject(TOKENS.UserService) private readonly userService: UserService,
  ) {}

  async login(credentials: AuthLoginAttributes) {
    const user = await this.userService.getUserByLogin(credentials.login);

    if (user && (await verifyPassword(credentials.password, user.password))) {
      return this.getToken({ login: user.login });
    } else {
      throw new Error('access-denied');
    }
  }

  async verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      verify(token, this.PRIVATE_KEY, (err, decoded) =>
        err ? reject(err) : resolve(decoded),
      );
    });
  }

  private getToken(payload: { login: string }) {
    return new Promise<string>((resolve, reject) => {
      sign(payload, this.PRIVATE_KEY, { expiresIn: 600 }, (err, token) =>
        err ? reject(err) : resolve(token as string),
      );
    });
  }
}
