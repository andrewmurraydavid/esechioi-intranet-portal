import { Inject, Injectable } from '@nestjs/common';
import { Macs } from 'src/entities/Macs.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class UDMProService {
  constructor(private readonly httpService: HttpService) {}

  token = null as string | null;
  csrfToken = null as string | null;

  private setToken = (response: AxiosResponse<any, any>) => {
    const setCookieHeader = response.headers['set-cookie'];
    const tokenFromCookie = setCookieHeader[0].split(';')[0].split('=')[1];
    const csrfTokenFromHeaders = response.headers['x-csrf-token'];

    this.token = tokenFromCookie;
    this.csrfToken = csrfTokenFromHeaders;

    console.log(`set new token: ${this.token}`);
    console.log(`set new csrfToken: ${this.csrfToken}`);

    return response;
  };

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
      // console.error("didn't work");
      console.log(error.response.data);
    }
  }

  async getDevices() {}

  async authorizeClient(mac: string) {
    try {
      await this.authorize();

      const headers = {
        Cookie: `TOKEN=${this.token}`,
        'X-CSRF-Token': this.csrfToken,
      };

      const data = {
        cmd: 'authorize-guest',
        mac: mac,
        minutes: 5,
      };

      const response = await this.httpService
        .post('/s/default/cmd/stamgr', data, { headers })
        .toPromise()
        .then(this.setToken);

      console.log(`authorized ${mac} for 5 minutes`);
    } catch (error) {
      console.error("didn't authorize client");
      console.log(error.response.data);
    }
  }
}
