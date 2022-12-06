import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/Users.entity';
import { Options } from 'src/entities/Options.entity';
import * as moment from 'moment';
import { Radpostauth } from 'src/entities/Radpostauth.entity';
import { orderBy } from 'lodash';

@Injectable()
export class UDMProService {
  constructor(
    private readonly httpService: HttpService,

    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<Users>,

    @Inject('OPTIONS_REPOSITORY')
    private optionsRepository: Repository<Options>,

    @Inject('RADPOSTAUTH_REPOSITORY')
    private radpostauthRepository: Repository<Radpostauth>,
  ) {}

  private readonly logger = new Logger(UDMProService.name);
  private token = null as string | null;
  private csrfToken = null as string | null;

  private readonly API_V2_BASE_URL = `https://${process.env.UDM_IP}/proxy/network/v2/api`;

  private setToken = (response: AxiosResponse<any, any>) => {
    const setCookieHeader = response.headers['set-cookie'];
    const tokenFromCookie = setCookieHeader[0].split(';')[0].split('=')[1];
    const csrfTokenFromHeaders = response.headers['x-csrf-token'];

    this.token = tokenFromCookie;
    this.csrfToken = csrfTokenFromHeaders;

    return response;
  };

  private _defaultDuration = 0;
  private _defaultTimes = 1;

  get defaultDuration() {
    if (this._defaultDuration) return this._defaultDuration;

    return this.optionsRepository
      .findOne({ where: { name: 'default_duration' } })
      .then((option) => {
        this._defaultDuration = +option.value;
        return this._defaultDuration;
      });
  }

  get defaultTimes() {
    if (this._defaultTimes) return this._defaultTimes;

    return this.optionsRepository
      .findOne({ where: { name: 'default_times' } })
      .then((option) => {
        this._defaultTimes = +option.value;
        return this._defaultTimes;
      });
  }

  private generateHeaders() {
    return {
      Cookie: `TOKEN=${this.token}`,
      'X-CSRF-Token': this.csrfToken,
    };
  }

  async canAuthorize(mac) {
    const getClientPostAuthsForToday = await this.radpostauthRepository
      .createQueryBuilder('radpostauth')
      .where('radpostauth.username = :username', { username: mac })
      .andWhere('radpostauth.authdate >= :today', {
        today: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      })
      .andWhere('radpostauth.authdate <= :tomorrow', {
        tomorrow: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      })
      .getMany();

    const times = await this.defaultTimes;
    this.logger.log(`allowed times: [${times}]; used times: [${getClientPostAuthsForToday.length}]`);

    if (getClientPostAuthsForToday.length >= times) {
      return false;
    } else {
      return true;
    }
  }

  async needsAuthorization(mac: string) {
    try {
      await this.authorize();

      const { data: guests } = await this.listGuests();

      const guestWithMac = orderBy(
        guests.data.filter((guest: any) => guest.mac === mac),
        'start',
        'desc',
      ).shift();

      return guestWithMac?.expired ?? true;
    } catch (error) {
      if (error?.response?.data) {
        this.logger.error("didn't get list with guests", error?.response?.data);
      } else if (error?.response) {
        this.logger.error("didn't get list with guests", error?.response);
      } else if (error) {
        this.logger.error("didn't get list with guests", error);
      }
    }
  }

  private async authorize() {
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
      if (error?.response?.data) {
        this.logger.error("didn't authorize", error?.response?.data);
      } else if (error?.response) {
        this.logger.error("didn't authorize", error?.response);
      } else if (error) {
        this.logger.error("didn't authorize", error);
      }
    }
  }

  async listGuests() {
    try {
      await this.authorize();
      const data = {
        within: 24,
      };

      return await this.httpService
        .post('/s/default/stat/guest', data, {
          headers: this.generateHeaders(),
        })
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      if (error?.response?.data) {
        this.logger.error("didn't get list with guests", error?.response?.data);
      } else if (error?.response) {
        this.logger.error("didn't get list with guests", error?.response);
      } else if (error) {
        this.logger.error("didn't get list with guests", error);
      }
    }
  }

  async extendClient(mac: string) {
    try {
      await this.authorize();

      const user = await this.usersRepository.findOne({
        where: { callingstationid: mac },
      });

      const guests = await this.listGuests();

      const guestWithMac = guests.data.data
        .filter((guest: any) => guest.mac === mac && guest.expired)
        .sort((a: any, b: any) => a.start - b.start)
        .pop();

      const data = {
        cmd: 'extend',
        _id: guestWithMac._id,
        duration: 5,
        minutes: await this.defaultDuration,
      };

      return await this.httpService
        .post('/s/default/cmd/hotspot', data, {
          headers: this.generateHeaders(),
        })
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      this.logger.error("didn't extend device", error?.response?.data);
    }
  }

  async authorizeClient(mac: string, minutes?: number) {
    try {
      await this.authorize();

      const user = await this.usersRepository.findOne({
        where: { callingstationid: mac },
      });

      const data = {
        cmd: 'authorize-guest',
        mac: mac,
        minutes: minutes ? minutes : await this.defaultDuration,
      };

      await this.httpService
        .post('/s/default/cmd/stamgr', data, {
          headers: this.generateHeaders(),
        })
        .toPromise()
        .then(this.setToken);

      this.logger.log(
        `authorized ${mac} for ${
          minutes ? minutes : await this.defaultDuration
        } minutes`,
      );

      await this.radpostauthRepository.save({
        username: mac,
        pass: user.username,
        reply: 'OK',
      });
    } catch (error) {
      if (error?.response?.data) {
        this.logger.error("didn't authorize device", error?.response?.data);
      } else if (error?.response) {
        this.logger.error("didn't authorize device", error?.response);
      } else if (error) {
        this.logger.error("didn't authorize device", error);
      }
    }
  }

  async unauthorizeClient(mac: string) {
    try {
      await this.authorize();

      const data = {
        cmd: 'unauthorize-guest',
        mac: mac,
      };

      await this.httpService
        .post('/s/default/cmd/stamgr', data, {
          headers: this.generateHeaders(),
        })
        .toPromise()
        .then(this.setToken);

      this.logger.log(`unauthorized ${mac}`);
    } catch (error) {
      this.logger.error("didn't unauthorize client", error?.response?.data);
    }
  }

  async blockClient(mac: string) {
    try {
      await this.authorize();

      const data = {
        cmd: 'block-sta',
        mac: mac,
      };

      await this.httpService
        .post('/s/default/cmd/stamgr', data, {
          headers: this.generateHeaders(),
        })
        .toPromise()
        .then(this.setToken);

      this.logger.log(`blocked ${mac}`);
    } catch (error) {
      this.logger.error("didn't block client", error?.response?.data);
    }
  }

  async unblockClient(mac: string) {
    try {
      await this.authorize();

      const data = {
        cmd: 'unblock-sta',
        mac: mac,
      };

      await this.httpService
        .post('/s/default/cmd/stamgr', data, {
          headers: this.generateHeaders(),
        })
        .toPromise()
        .then(this.setToken);

      this.logger.log(`unblocked ${mac}`);
    } catch (error) {
      this.logger.error("didn't unblock client", error?.response?.data);
    }
  }

  async getHistoryClients() {
    try {
      await this.authorize();

      return await this.httpService
        .get('/s/default/clients/history?withinHours=0', {
          headers: this.generateHeaders(),
        })
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      this.logger.error("didn't get blocked clients", error?.response?.data);
    }
  }

  async getActiveClients({ includeTrafficUsage = false }) {
    try {
      await this.authorize();

      return await this.httpService
        .get(
          `${this.API_V2_BASE_URL}/site/default/clients/active${
            includeTrafficUsage ? '?includeTrafficUsage=true' : ''
          }`,
          { headers: this.generateHeaders() },
        )
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      this.logger.error("didn't get active clients", error?.response?.data);
    }
  }

  async getBlockedClients() {
    try {
      await this.authorize();

      return await this.httpService
        .get(
          `${this.API_V2_BASE_URL}/site/default/clients/history?onlyBlocked=true&withinHours=0`,
          { headers: this.generateHeaders() },
        )
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      this.logger.error(error);
      this.logger.error("didn't get blocked clients", error?.response?.data);
    }
  }

  async getNonBlockedClients() {
    try {
      await this.authorize();

      return await this.httpService
        .get(
          `${this.API_V2_BASE_URL}/site/default/clients/history?onlyNonBlocked=true&withinHours=0`,
          { headers: this.generateHeaders() },
        )
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      this.logger.error("didn't get non blocked clients", error?.response?.data);
    }
  }

  async getDailyUserReport(mac: string, start?: number, end?: number) {
    if (!start) {
      start = moment().startOf('day').add(1, 'hour').unix() * 1000;
    }
    try {
      await this.authorize();

      const data = {
        attrs: ['_id', 'time', 'uptime', 'duration', 'num_sta'],
        macs: [mac],
        start: start,
        end: end,
      };

      return await this.httpService
        .post(`/s/default/stat/report/daily.user`, data, {
          headers: this.generateHeaders(),
        })
        .toPromise()
        .then(this.setToken);
    } catch (error) {
      this.logger.error("didn't get daily user report", error?.response?.data);
    }
  }
}
