import {Schema , Prop,SchemaFactory} from '@nestjs/mongoose'
import { Document, ObjectId, Types, Schema as MongooseSchema } from 'mongoose'
import { AbstractDocument } from '../abstract.schema'

export type classDocument = Class & Document

@Schema({versionKey: false, collection: 'classes'})
export class Class extends AbstractDocument {
    @Prop({type: String})
    className: string

    @Prop()
    course: ObjectId

    @Prop({type: Date})
    date: Date

    @Prop()
    user: ObjectId

    @Prop({type:[
        {userId: MongooseSchema.Types.ObjectId, }
    ]})
    booked: {userId: ObjectId}[]
}

export const classSchema = SchemaFactory.createForClass(Class)