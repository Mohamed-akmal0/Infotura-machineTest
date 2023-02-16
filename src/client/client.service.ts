import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ClientRepo } from './client.repository';
import { createUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { response, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { getClientDetailsDto } from './dto/getClientDetails.dto';
import { BookClassDto } from './dto/book-class.dto';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepo: ClientRepo,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(body: createUserDto) {
    const salt = 10;
    body.password = await bcrypt.hash(body.password, salt);
    const existEmail = await this.clientRepo.findEmail(body.email);
    if (existEmail != null) throw new BadRequestException('registered ');
    return this.clientRepo.Register(body);
  }

  async Login(body: loginUserDto, response: Response) {
    const { email, password } = body;
    const user = await this.clientRepo.findEmail(email);
    if (user === null) throw new NotFoundException('wrong_email');
    const { isApproved, isReject } = user;
    const hashedPassword = await bcrypt.compare(password, user.password);
    if (hashedPassword === false)
      throw new UnauthorizedException('wrong_password');
    if (isApproved === false) throw new ForbiddenException('not_approved');
    if (isReject === true) throw new BadRequestException('rejected');
    const token = await this.signToken({ id: user._id, email });
    response.cookie('user_jwt' , token,{httpOnly: false})
    return user._id;
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;
    const clientSecret = this.configService.get('CLIENT_SECRET');
    console.log(clientSecret);
    return await this.jwtService.signAsync(payload, { secret: clientSecret });
  }

  async getDetails(id: getClientDetailsDto) {
    const clientDetails = await this.clientRepo.getClientDetails(id);
    return clientDetails;
  }

  async book(id: BookClassDto, body: BookClassDto) {
    const bookedClass = await this.clientRepo.bookClass(id, body);
    return bookedClass;
  }
}
