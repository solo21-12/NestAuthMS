import { Injectable } from '@nestjs/common';
import { UserServiceRepository } from './user-service.repository';
import { UserDto, CreateUserDto } from '@app/contracts';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UserServiceService {
  constructor(private readonly userServiceRepository: UserServiceRepository) {}

  private userToDto(user: UserDocument): UserDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userServiceRepository.create(userDto);
    return this.userToDto(user);
  }

  async findById(id: string): Promise<UserDto | null> {
    const user = await this.userServiceRepository.findById(id);
    if (!user) return null;
    return this.userToDto(user);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userServiceRepository.findByEmail(email);
    if (!user) return null;
    return this.userToDto(user);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userServiceRepository.findAll();
    return users.map(this.userToDto);
  }

  async update(
    id: string,
    userDto: Partial<CreateUserDto>,
  ): Promise<UserDto | null> {
    const updatedUser = await this.userServiceRepository.update(id, userDto);
    if (!updatedUser) return null;
    return this.userToDto(updatedUser);
  }

  async delete(id: string): Promise<UserDto | null> {
    const deletedUser = await this.userServiceRepository.delete(id);
    if (!deletedUser) return null;
    return this.userToDto(deletedUser);
  }
}
