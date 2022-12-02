import { Inject, Injectable } from '@nestjs/common';
import { Macs } from 'src/entities/Macs.entity';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<Users>,
  ) {}
  registerUser(
    mac: string,
    username: string,
    fullname: string,
  ): Promise<Users> {
    return this.usersRepository.save({ callingstationid: mac, username });
  }

  async findUserByMac(mac: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { callingstationid: mac } });
  }

  async findUserByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async getAllUsers(): Promise<Users[]> {
    return this.usersRepository.find();
  }
}
