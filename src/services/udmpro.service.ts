import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/Users.entity';

@Injectable()
export class UDMProService {
  constructor(
    private readonly httpService: HttpService,
    

    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<Users>,
    ) {}

  token = null as string | null;
  csrfToken = null as string | null;

  private setToken = (response: AxiosResponse<any, any>) => {
    const setCookieHeader = response.headers['set-cookie'];
    const tokenFromCookie = setCookieHeader[0].split(';')[0].split('=')[1];
    const csrfTokenFromHeaders = response.headers['x-csrf-token'];

    this.token = tokenFromCookie;
    this.csrfToken = csrfTokenFromHeaders;

    return response;
  };

  private generateHeaders() {
    return {
      Cookie: `TOKEN=${this.token}`,
      'X-CSRF-Token': this.csrfToken,
    };
  }

  async authorize() {
    try {
      const data = {
        username: process.env.UDM_USERNAME,
        password: process.env.UDM_PASSWORD,
      };

      await this.httpService
        .post(`https://${process.env.UDM_IP}/api/auth/login`, data)
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      console.error("didn't authorize", error.response.data);
    }
  }

  async listGuests() {
    try {
      await this.authorize();
      const data = {
        within: 24
      };

      return await this.httpService
        .post('/s/default/stat/guest', data, { headers: this.generateHeaders() })
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      console.error("didn't get list with guests", error.response.data);
    }
  }

  async extendClient(mac: string) {
    try {
      await this.authorize();

      const user = await this.usersRepository.findOne({ where: { callingstationid: mac } });

      const guests = await this.listGuests();

      const guestWithMac = guests.data.data.filter((guest: any) => guest.mac === mac && guest.expired).sort((a: any, b: any) => a.start - b.start).pop();

      const data = {
        cmd: 'extend',
        _id: guestWithMac._id,
        duration: 5,
        minutes: 5,
      };

      return await this.httpService
        .post('/s/default/cmd/hotspot', data, { headers: this.generateHeaders() })
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      console.error("didn't extend device", error.response.data);
    }
  }


  async authorizeClient(mac: string) {
    try {
      await this.authorize();

      const user = await this.usersRepository.findOne({ where: { callingstationid: mac } });

      const data = {
        cmd: 'authorize-guest',
        mac: mac,
        minutes: 2,
      };

      await this.httpService
        .post('/s/default/cmd/stamgr', data, { headers: this.generateHeaders() })
        .toPromise()
        .then(this.setToken);

      console.log(`authorized ${mac} for 5 minutes`);
    } catch (error) {
      console.error("didn't authorize client", error.response.data);
    }
  }
}
