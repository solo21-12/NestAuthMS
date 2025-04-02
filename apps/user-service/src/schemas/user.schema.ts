import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'libs/constants';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER }) // Fix applied here
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
