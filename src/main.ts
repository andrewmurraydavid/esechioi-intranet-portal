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
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(number) / Math.log(1024));
    return `${(number / 1024 ** i).toFixed(2)} ${units[i]}`;
  });



  app.setViewEngine('hbs');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(80);
}
bootstrap();
