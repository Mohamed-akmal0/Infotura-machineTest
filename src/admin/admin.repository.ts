import {
  Class,
  classDocument,
  Course,
  CourseDocument,
  User,
  UserDocument,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { createCourseDto } from 'src/admin/dto/create-course.dto';
import { AddClassDto } from './dto/add-class.dto';

@Injectable()
export class AdminRepo {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<classDocument>,
  ) {}

  async findAdmin(): Promise<User> {
    try {
      const admin = await this.userModel.findOne({ isAdmin: true });
      return admin;
    } catch (e) {
      console.log(e);
    }
  }

  async Clients(): Promise<User> {
    try {
      const notApproved = await this.userModel.find({
        isApproved: false,
        isAdmin: false,
      });
      //@ts-ignore
      return notApproved;
    } catch (error) {
      console.log(error);
    }
  }

  async course(body: createCourseDto): Promise<Course> {
    try {
      const addedCourse = new this.courseModel(body);
      addedCourse.save();
      return addedCourse;
    } catch (error) {
      console.log(error);
    }
  }
  async getCourse(): Promise<Course[]> {
    try {
      const totalCourse = await this.courseModel.find(
        { isDelete: false },
        { isDelete: 0 },
      );
      return totalCourse;
    } catch (error) {
      console.log(error);
    }
  }
  async editCourse(id: string, body: createCourseDto): Promise<object> {
    try {
      const { courseName } = body;
      console.log(courseName);
      const edited = await this.courseModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        {
          $set: {
            courseName: courseName,
          },
        },
      );
      return { message: 'success' };
    } catch (error) {
      console.log(error);
    }
  }
  async deleteCourse(id: string): Promise<object> {
    try {
      await this.courseModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        {
          $set: {
            isDelete: true,
          },
        },
      );
      return { message: 'success' };
    } catch (error) {}
  }
  async getDeletedCourse(): Promise<Course[]> {
    try {
      const deletedCourse = await this.courseModel.find(
        { isDelete: true },
        { isDelete: 0 },
      );
      return deletedCourse;
    } catch (error) {
      console.log(error);
    }
  }
  async totalCount(): Promise<number> {
    try {
      const getTotalCount = await this.userModel.find({}).count();
      console.log(getTotalCount);
      return getTotalCount;
    } catch (error) {
      console.log(error);
    }
  }
  async getApplication(): Promise<User[]> {
    try {
      const notApprovedApplication = await this.userModel.find({
        isApproved: false,
        isAdmin: false,
      });
      return notApprovedApplication;
    } catch (error) {
      console.log(error);
    }
  }
  async approveClient(Id: string): Promise<object> {
    //@ts-ignore
    const { id } = Id;
    try {
      await this.userModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        {
          $set: {
            isApproved: true,
          },
        },
      );
      return { message: 'success' };
    } catch (error) {
      console.log(error);
    }
  }
  async rejectClient(Id: string): Promise<object> {
    //@ts-ignore
    const { id } = Id;
    console.log(id);
    try {
      await this.userModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            isReject: true,
          },
        },
      );
      return { message: 'success' };
    } catch (error) {
      console.log(error);
    }
  }
  async getApprovedClients(): Promise<User[]> {
    try {
      const getClientsDetails = await this.userModel.aggregate([
        {
          $match: {},
        },
        {
          $lookup: {
            localField: 'course',
            from: 'Courses',
            foreignField: '_id',
            as: 'clientDetails',
          },
        },
        {
          $unwind: '$clientDetails',
        },
        {
          $project: {
            email: 1,
            course: '$clientDetails.courseName',
          },
        },
      ]);
      console.log(getClientsDetails);
      return getClientsDetails;
    } catch (error) {
      console.log(error);
    }
  }
  async restoreCourse(Id: string): Promise<object> {
    //@ts-ignore
    const { id } = Id;
    try {
      await this.courseModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            isDelete: false,
          },
        },
      );
      return { message: 'success' };
    } catch (error) {}
  }
  async addClass(body: AddClassDto): Promise<object> {
    try {
      // body.course = new mongoose.Types.ObjectId(body.course)
      console.log(body);
      const added = new this.classModel(body);
      added.save();
      return { message: 'success' };
    } catch (error) {
      console.log(error);
    }
  }
  async getClass(): Promise<Class[]> {
    try {
      const getAddedClass = await this.classModel.aggregate([
        {
          $lookup: {
            localField: 'course',
            from: 'Courses',
            foreignField: '_id',
            as: 'CourseDetails',
          },
        },
        { $unwind: '$CourseDetails' },
        {
          $project: {
            className: 1,
            course: '$CourseDetails.courseName',
            date: 1,
          },
        },
      ]);
      return getAddedClass;
    } catch (error) {
      console.log(error)
    }
  }

  async getBookedClass(): Promise<Class[]>{
    try {
      const getClass = await this.classModel.aggregate([{
        $unwind: "$booked"
      },{
        $lookup:{
          localField: "course",
          from:"Courses",
          foreignField: "_id",
          as: "detailsOfCourse"
        }
      },{
        $unwind: "$detailsOfCourse"
      },{
        $lookup:{
          localField: "booked.id",
          from: "Clients",
          foreignField: "_id",
          as: "detailsOfClients"
        }
      },
      {
        $unwind: "$detailsOfClients"
      },{
        $project:{
          className:  1,
          date: 1,
          courseName: "$detailsOfCourse.courseName",
          email: "$detailsOfClients.email"
        }
      }
    ])
      console.log(getClass)
      return 
    } catch (error) {
      console.log(error)
    }
  }
}
