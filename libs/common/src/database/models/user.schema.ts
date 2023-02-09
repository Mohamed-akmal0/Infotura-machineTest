import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";
import { Document , ObjectId } from "mongoose";

export type UserDocument = User & Document

@Schema({versionKey: false,collection: 'Clients'})
export class User{
    @Prop({type: String})
    email: string

    @Prop({type: String})
    password: string

    @Prop()
    course: ObjectId
}

export const UserSchema = SchemaFactory.createForClass(User)