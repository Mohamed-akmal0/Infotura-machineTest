import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { ClientService } from './client.service';
import { BookClassDto } from './dto/book-class.dto';
import { createUserDto } from './dto/create-user.dto';
import { getClientDetailsDto } from './dto/getClientDetails.dto';
import { loginUserDto } from './dto/login-user.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('signup')
  Signup(@Body() body: createUserDto) {
    return this.clientService.register(body);
  }
  @HttpCode(200)
  @Post('login')
  login(@Body() body: loginUserDto, @Res({passthrough: true}) response: Response) {
    return this.clientService.Login(body, response);
  }

  @Get('getClientDetails/:id')
  getClientDetails(@Param() id: getClientDetailsDto) {
    return this.clientService.getDetails(id);
  }

  @Patch('bookClass/:id')
  bookClass(@Param() id: BookClassDto, @Body() body: BookClassDto) {
    console.log(id, body);
    return this.clientService.book(id, body);
  }
}
