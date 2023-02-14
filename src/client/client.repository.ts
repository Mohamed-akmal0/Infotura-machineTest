import { Class, classDocument, User, UserDocument } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookClassDto } from './dto/book-class.dto';
import { createUserDto } from './dto/create-user.dto';
import { getClientDetailsDto } from './dto/getClientDetails.dto';

@Injectable()
export class ClientRepo {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  @InjectModel(Class.name) private readonly classModel: Model<classDocument>
  ) {}

  async Register(body: createUserDto): Promise<object> {
    console.log(body);
    try {
      const registered = new this.userModel(body);
      registered.save();
      return { message: 'success' };
    } catch (err) {
      console.log(err);
    }
  }

  async findEmail(email: string) {
    try {
      const findEmail = await this.userModel.findOne({ email });
      return findEmail;
    } catch (e) {
      console.log(e);
    }
  }

  async getClientDetails(Id: getClientDetailsDto): Promise<User[]>{
    const {id} = Id
      try {
       const clientDetails = await this.userModel.aggregate([{
          $match:{
            _id: new Types.ObjectId(id)
          }
        },{
          $lookup:{
            localField: "course",
            from: "Courses",
            foreignField: "_id",
            as: "courseDetails"
          }
        },{
          $lookup:{
            localField: "course",
            from:"classes",
            foreignField: "course",
            as: "classDetails"
          }
        },{
          $unwind: "$courseDetails"
        },
        {
          $project:{
            email:1,
            course: "$courseDetails.courseName",
            class: "$classDetails"
          }
        }
      ]) 
        return clientDetails[0]
      } catch (error) {
        console.log(error)
      }
  }
  async bookClass(Id: BookClassDto,body: BookClassDto): Promise<Class[]>{
    const {id} = Id
    try{
      const bookeClass = await this.classModel.findByIdAndUpdate({
        _id: new Types.ObjectId(body.Id)
      },{
        $addToSet:{
          booked: {userId: id}
        }
      }
      )
      console.log(bookeClass)
      return
    }catch(error){
      console.log(error)
    }
  }
}
