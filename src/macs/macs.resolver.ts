import { Query, Resolver } from '@nestjs/graphql';
import { Macs } from 'src/entities/Macs';

@Resolver((of) => Macs)
export class MacsResolver {
  @Query((returns) => [Macs])
  async macs() {
    return [1, 2, 3];
  }
}
