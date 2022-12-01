import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/guest/s/default/')
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}
