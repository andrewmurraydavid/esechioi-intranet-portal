import { Inject, Injectable } from '@nestjs/common';
import { Macs } from 'src/entities/Macs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MacsService {
  constructor(
    @Inject('MACS_REPOSITORY')
    private macsRepository: Repository<Macs>,

    @Inject('NAS_REPOSITORY')
    private nasRepository: Repository<Macs>,

    @Inject('RADACCT_REPOSITORY')
    private radacctRepository: Repository<Macs>,

    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<Macs>,
  ) {}

  checkMac(mac: string): Promise<Macs> {
    return this.macsRepository.findOne({ where: { callingstationid: mac } });
  }

  findAcctByMac(mac: string): Promise<Macs> {
    return this.radacctRepository.findOne({ where: { callingstationid: mac } });
  }

  registerMac(mac: string, username: string, fullname: string): Promise<Macs> {
    this.usersRepository.save({ callingstationid: mac, username, fullname });
    return this.macsRepository.save({ callingstationid: mac, username });
  }
}
