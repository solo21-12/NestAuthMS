import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ERROR_MESSAGES, USER_ROLES } from 'libs/constants';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  constructor() {
    super(null, null);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedException(ERROR_MESSAGES.ONLY_ADMINS_ALLOWED);
    }

    return true;
  }
}
