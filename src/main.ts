declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import { DateTime } from 'luxon';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  hbs.handlebars.helpers = {
    ...require('handlebars-helpers')(),
  };

  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerHelper(
    'json',
    (context) => `<pre>${JSON.stringify(context, null, 2)}</pre>`,
  );

  hbs.registerHelper('dateTime', (date: number | string) => {
    const dt = DateTime.fromMillis(Number(date) * 1000);
    return dt.toFormat('yyyy-MM-dd HH:mm:ss');
  });

  hbs.registerHelper('dateRelative', (date: number | string) => {
    const dt = DateTime.fromMillis(Number(date) * 1000);
    return dt.toRelative();
  });

  hbs.registerHelper('numberToBytes', (number: number) => {
    if (!number) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(number) / Math.log(1024));
    return `${(number / 1024 ** i).toFixed(2)} ${units[i]}`;
  });

  hbs.registerHelper('macCode', (mac: string) => {
    return `<code class="code bg-gray-300 block rounded">MAC: ${mac}</code>`;
  });

  hbs.registerHelper('rx', () => {
    return `<i class="mdi mdi-menu-down text-lg text-green-600"></i>`;
  });

  hbs.registerHelper('tx', () => {
    return `<i class="mdi mdi-menu-up text-lg text-red-600"></i>`;
  });

  hbs.registerHelper('formattedDuration', (duration: number) => {
    if (!duration) return '-';

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  });

  app.setViewEngine('hbs');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(80);
}
bootstrap();
