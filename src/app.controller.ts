import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { MacsService } from './services/macs.service';
import { UDMProService } from './services/udmpro.service';

@Controller('/guest/s/default')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly macsService: MacsService,
    private readonly udmService: UDMProService,
  ) {}

  @Get('/')
  async root(@Req() req: Request, @Res() res: Response) {
    const { query } = req;
    const temp = await this.macsService.checkMac(query.id as string);

    if (!temp) {
      return res.render('index', { ...query });
    } else {
      const needsAuthorization = await this.udmService.needsAuthorization(temp.callingstationid);
      const canAuthorize = await this.udmService.canAuthorize(temp.callingstationid);

      console.log('needsAuthorization', needsAuthorization, 'canAuthorize', canAuthorize);

      if (!needsAuthorization) {
        return res.render('success', { ...query, ...temp});
      } else if (needsAuthorization && canAuthorize) {
        this.udmService.authorizeClient(query.id as string);
        return res.render('success', { ...query });
      } else {
        return res.status(401).render('failure', { ...query });
      }
    }
  }

  @Post('/register')
  async register(@Req() req: Request, @Res() res: Response) {
    const { body } = req;
    console.log('registering', body);
    const temp = await this.macsService.registerMac(
      body.mac,
      body.username,
      body.fullname,
    );

    if (temp) {
      return res.render('success', {
        ...temp,
        ssid: body.ssid,
        url: body.redirectUrl,
      });
    } else {
      return res.render('index', { ...body });
    }
  }
}
