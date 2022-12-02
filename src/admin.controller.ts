import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { UDMProService } from './services/udmpro.service';
import { UsersService } from './services/users.service';
import { chain, orderBy, sortBy } from 'lodash';

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
        const user = users.find((user) => user.callingstationid === client.mac);

        return { ...client, user };
      }),
    );

    const sortedClients = chain(clientsWithUsers)
      .sortBy('end')
      .reverse()
      .groupBy('mac')
      .map((group) => group[0])
      .value();

    const { data: blockedClients } = await this.udmService.getBlockedClients();
    const { data: nonBlocked } = await this.udmService.getNonBlockedClients();
    const { data: active } = await this.udmService.getActiveClients({
      includeTrafficUsage: true,
    });

    console.log('blockedClients', blockedClients.length);
    console.log('nonBlocked', nonBlocked.length);

    const mergedClients = sortedClients.map((client) => {
      const blockedClient = blockedClients.find((bc) => bc.mac === client.mac);
      const nonBlockedClient = nonBlocked.find((nbc) => nbc.mac === client.mac);
      const activeClient = active.find((ac) => ac.mac === client.mac);

      const mergedClient = {
        ...client,
        ...activeClient,
        ...blockedClient,
        ...nonBlockedClient,
      };

      return mergedClient;
    });

    return { clients: orderBy(mergedClients, 'blocked', 'desc') };
  }

  @Post('/admin-sta-actions')
  async blockMac(@Req() req: Request, @Res() res: Response) {
    const { body } = req;
    const { mac, action } = body;

    if (action === 'block') {
      await this.udmService.blockClient(mac);
      return res.json({ success: true });
    } else if (action === 'unblock') {
      await this.udmService.unblockClient(mac);
      return res.json({ success: true });
    } else if (action === 'renew') {
      await this.udmService.authorizeClient(mac);
      return res.json({ success: true });
    } else if (action === 'kick') {
      await this.udmService.unauthorizeClient(mac);
      return res.json({ success: true });
    }
    // keep this line here
    else {
      return res
        .status(404)
        .send({ success: false, message: 'Invalid action' });
    }
  }
}
