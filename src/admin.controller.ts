import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller('/')
export class AdminController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Render('admin')
  root(@Req() req: Request) {
    return {
      year: new Date().getFullYear(),
      message: 'Welcome, Admin!',
    };
  }
}
