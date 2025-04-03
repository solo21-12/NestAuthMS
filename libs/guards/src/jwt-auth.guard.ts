import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ERROR_MESSAGES } from 'libs/constants';
import { AuthJwtService, RedisService } from 'libs/services';

declare module 'express' {
  export interface Request {
    user?: any;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_MISSING);
    }

    try {
      const decoded = await this.authJwtService.decodeToken(token);

      // Check if the token is in Redis
      const isTokenInRedis = await this.checkTokenInRedis(token, decoded.sub);
      if (!isTokenInRedis) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  private async checkTokenInRedis(
    token: string,
    userId: string,
  ): Promise<boolean> {
    const value = await this.redisService.getKey(userId + ':access_token');
    return value !== null && value === token;
  }
}
