import {
  CreateUserDto,
  CreateUserRto,
  USER_SERVICES_PATTERNS,
  GetUserRto,
  UpdateUserRto,
} from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE_CONSTANTS, UserRole } from 'libs/constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserServiceService {
  constructor(
    @Inject(USER_SERVICE_CONSTANTS.NAME)
    private readonly userClient: ClientProxy,
  ) {}

  private userDtoToRto(user: any): CreateUserRto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    };
  }

  async findAll(): Promise<GetUserRto[]> {
    const users$ = this.userClient.send(USER_SERVICES_PATTERNS.FIND_ALL, {});
    const users = await lastValueFrom(users$);
    return users.map((user: any) => this.userDtoToRto(user));
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserRto> {
    const user$ = this.userClient.send(
      USER_SERVICES_PATTERNS.CREATE,
      createUserDto,
    );
    const user = await lastValueFrom(user$);
    return this.userDtoToRto(user);
  }

  async findById(id: string): Promise<GetUserRto> {
    const user$ = this.userClient.send(USER_SERVICES_PATTERNS.FIND_ONE, id);
    const user = await lastValueFrom(user$);
    return this.userDtoToRto(user);
  }

  async update(
    id: string,
    updateUserDto: CreateUserDto,
  ): Promise<UpdateUserRto> {
    const user$ = this.userClient.send(USER_SERVICES_PATTERNS.UPDATE, {
      id,
      ...updateUserDto,
    });
    const user = await lastValueFrom(user$);
    return this.userDtoToRto(user);
  }

  async delete(id: string): Promise<void> {
    const delete$ = this.userClient.send(USER_SERVICES_PATTERNS.REMOVE, id);
    await lastValueFrom(delete$);
  }
}
