import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordHashService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.saltRounds);
    return hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
