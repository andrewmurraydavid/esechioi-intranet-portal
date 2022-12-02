import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { UDMProService } from './services/udmpro.service';
import { UsersService } from './services/users.service';

@Controller('/')
export class AdminController {
  constructor(
    private readonly appService: AppService,
    private readonly udmService: UDMProService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/')
  @Render('admin')
  async root(@Req() req: Request) {
    const { data: clients } = await this.udmService
      .listGuests()
      .then((res) => res.data);
    const users = await this.usersService.getAllUsers();
    
    const clientsWithUsers = await Promise.all(
      clients.map(async (client) => {
        const user = users.find(user => user.callingstationid === client.mac);

        return { ...client, user };
      }),
    );

    return { clients: clientsWithUsers };
  }
}
