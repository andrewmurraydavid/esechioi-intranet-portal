import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Get the name of the view to render from the request object. If the request
   * is for the root path, return the index view
   * @param req The request object.
   * @returns The name of the view to render.
   */
  getViewName(req: Request): string {
    return req.url === '/' ? 'index' : req.url;
  }
}
