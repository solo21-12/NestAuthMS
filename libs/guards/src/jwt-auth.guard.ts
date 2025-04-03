import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RedisService } from 'libs/services';

declare module 'express' {
  export interface Request {
    user?: any;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Check if the token is in Redis
      const isTokenInRedis = await this.checkTokenInRedis(token, decoded.sub);
      if (!isTokenInRedis) {
        throw new UnauthorizedException('Invalid or expired token f');
      }

      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
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
