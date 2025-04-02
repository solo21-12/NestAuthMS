import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '@app/contracts';

export class UserServiceRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async update(
    id: string,
    user: Partial<CreateUserDto>,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
