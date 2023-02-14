import { Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class AbstractDocument {
  _id: mongoose.Types.ObjectId;
}
