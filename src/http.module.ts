import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpService, HttpModule as BaseHttpModule } from '@nestjs/axios';
import * as https from 'https';
import { ConfigModule } from '@nestjs/config';

const chalk = require('chalk')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    BaseHttpModule.register({
      timeout: 5000,
      baseURL: `https://${process.env.UDM_IP}/proxy/network/api`,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }),
  ],
  exports: [BaseHttpModule],
})
export class HttpModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  public onModuleInit(): any {
    const logger = new Logger('Axios');
    logger.log('Initializing Axios');

    // Add request interceptor and response interceptor to log request infos
    const axios = this.httpService.axiosRef;

    axios.interceptors.request.use(function (config) {
      // Please don't tell my Typescript compiler...
      config['metadata'] = { ...config['metadata'], startDate: new Date() };
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        const { config } = response;
        config['metadata'] = { ...config['metadata'], endDate: new Date() };
        const duration =
          config['metadata'].endDate.getTime() -
          config['metadata'].startDate.getTime();

        // Log some request infos (you can actually extract a lot more if you want: the content type, the content size, etc.)
        logger.log(
          `${config.method.toUpperCase()} ${chalk.blueBright(
            config.url.startsWith('http')
              ? config.url
              : config.baseURL + config.url,
          )} ${duration}ms`,
        );

        return response;
      },
      (err) => {
        logger.error(err);

        // Don't forget this line like I did at first: it makes your failed HTTP requests resolve with "undefined" :-(
        return Promise.reject(err);
      },
    );
  }
}
