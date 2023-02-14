import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  HttpCode,
} from '@nestjs/common';
import { createCourseDto } from 'src/admin/dto/create-course.dto';
import { AdminService } from './admin.service';
import { AddClassDto } from './dto/add-class.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(200)
  @Post('login')
  Login(@Body() body: AdminLoginDto) {
    return this.adminService.AdminLogin(body);
  }

  @Get('clients')
  Clients() {
    return this.adminService.getClients();
  }

  @Post('addCourse')
  addCourse(@Body() body: createCourseDto) {
    console.log(body);
    return this.adminService.addCourse(body);
  }

  @Get('getCourse')
  getCourse() {
    return this.adminService.getTotalCourse();
  }
  @Patch('editCourse/:id')
  editCourse(@Param() id: string, @Body() body: createCourseDto) {
    return this.adminService.edit(id, body);
  }
  @Patch('deleteCourse/:id')
  deleteCourse(@Param() id: string) {
    return this.adminService.delete(id);
  }
  @Get('getDeleteCourse')
  getDeleteCourse() {
    return this.adminService.deletedCourse();
  }
  @Get('clientCount')
  count() {
    return this.adminService.getCount();
  }
  @Get('getApplications')
  getApplication() {
    return this.adminService.application();
  }
  @Patch('approveClient/:id')
  approveClient(@Param() id: string) {
    return this.adminService.approve(id);
  }

  @Patch('rejectClient/:id')
  rejectClient(@Param() id: string) {
    return this.adminService.reject(id);
  }

  @Get('getApprovedClients')
  getApprovedClients() {
    return this.adminService.approvedClients();
  }
  @Patch('restoreCourse/:id')
  restoreCourse(@Param() id: string) {
    return this.adminService.restore(id);
  }
  @Patch('addClass')
  addClass(@Body() body: AddClassDto) {
    console.log(body)
    return this.adminService.AddClass(body);
  }
  @Get('getClass')
  getClass() {
    return this.adminService.getAddedClass();
  }

  @Get('getBookedClass')
  getBookedClass(){
    return this.adminService.bookedClass()
  }
}
