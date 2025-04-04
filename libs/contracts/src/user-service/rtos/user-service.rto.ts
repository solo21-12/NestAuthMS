import { UserRole } from 'libs/constants';

export class CreateUserRto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export class UpdateUserRto {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

export class GetUserRto {
  id: string;
  name: string;
  email: string;
}

export class DeleteUserRto {
  message: string;
}
