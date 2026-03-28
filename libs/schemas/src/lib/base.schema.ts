import { Type } from '@nestjs/common';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export class BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const createSchema = <TClass = any>(target: Type<TClass>) => {
  const schema = SchemaFactory.createForClass(target);

  schema.set('toJSON', { virtuals: true });

  schema.set('toObject', { virtuals: true });

  schema.set('versionKey', false);

  schema.set('timestamps', true);

  return schema;
};
