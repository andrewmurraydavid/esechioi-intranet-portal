import { Inject, Injectable } from '@nestjs/common';
import { Macs } from 'src/entities/Macs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MacsService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<Macs>,
  ) {}
  registerUser(mac: string, username: string, fullname: string): Promise<Macs> {
    return this.usersRepository.save({ callingstationid: mac, username });
  }
}
