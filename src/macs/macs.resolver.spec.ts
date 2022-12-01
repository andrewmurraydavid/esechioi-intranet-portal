import { Test, TestingModule } from '@nestjs/testing';
import { MacsResolver } from './macs.resolver';

describe('MacsResolver', () => {
  let resolver: MacsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MacsResolver],
    }).compile();

    resolver = module.get<MacsResolver>(MacsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
