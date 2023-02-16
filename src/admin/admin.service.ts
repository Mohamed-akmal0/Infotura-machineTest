import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminRepo } from './admin.repository';
import { AdminLoginDto } from './dto/admin-login.dto';
import * as bcrypt from 'bcrypt';
import { createCourseDto } from 'src/admin/dto/create-course.dto';
import { AddClassDto } from './dto/add-class.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepo: AdminRepo,
    private jwtService: JwtService,
  ) {}

  async AdminLogin(body: AdminLoginDto , response: Response) {
    const { email, password } = body;
    const FindAdmin = await this.adminRepo.findAdmin();
    if (email !== FindAdmin.email)
      throw new UnauthorizedException('wrong_email');
    const hashedPassword = await bcrypt.compare(password, FindAdmin.password);
    if (hashedPassword === false)
      throw new UnauthorizedException('wrong_password');
    const jwt = await this.jwtService.signAsync({ id: FindAdmin._id });
    response.cookie('admin_jwt' , jwt, {httpOnly: false})
    return { message: 'success' };
  }

  async getClients() {
    const clients = await this.adminRepo.Clients();
    return clients;
  }

  async addCourse(body: createCourseDto) {
    const courseAdded = await this.adminRepo.course(body);
    return courseAdded;
  }
  async getTotalCourse() {
    return await this.adminRepo.getCourse();
  }
  async edit(id: string, body: createCourseDto) {
    const editedCourse = await this.adminRepo.editCourse(id, body);
    return editedCourse;
  }
  async delete(id: string) {
    return await this.adminRepo.deleteCourse(id);
  }
  async deletedCourse() {
    return this.adminRepo.getDeletedCourse();
  }
  async getCount() {
    return await this.adminRepo.totalCount();
  }
  async application() {
    return await this.adminRepo.getApplication();
  }
  async approve(id: string) {
    return await this.adminRepo.approveClient(id);
  }

  async reject(id: string) {
    return await this.adminRepo.rejectClient(id);
  }

  async approvedClients() {
    return await this.adminRepo.getApprovedClients();
  }
  async restore(id: string) {
    return await this.adminRepo.restoreCourse(id);
  }
  async AddClass(body: AddClassDto) {
    return await this.adminRepo.addClass(body);
  }
  async getAddedClass() {
    return await this.adminRepo.getClass();
  }
  async bookedClass (){
    const classesThatBooked = await this.adminRepo.getBookedClass()
    return classesThatBooked
  }
}
