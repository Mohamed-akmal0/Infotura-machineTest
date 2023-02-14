import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../abstract.schema';

export type CourseDocument = Course & Document;

@Schema({ versionKey: false, collection: 'Courses' })
export class Course extends AbstractDocument {
  @Prop({ type: String })
  courseName: string;

  @Prop({ type: Boolean, default: false })
  isDelete: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
