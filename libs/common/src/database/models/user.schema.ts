import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { AbstractDocument } from '../abstract.schema';

export type UserDocument = User & Document;

@Schema({ versionKey: false, collection: 'Clients' })
export class User extends AbstractDocument {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop()
  course: ObjectId;

  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;

  @Prop({ type: Boolean, default: false })
  isApproved: boolean;

  @Prop({ type: Boolean, default: false })
  isReject: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
