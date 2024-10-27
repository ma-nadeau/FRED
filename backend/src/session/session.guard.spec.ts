import { SessionGuard } from './session.guard';
import { ExecutionContext } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('SessionGuard', () => {
  it('should be defined', () => {
    const mockExecutionContext = mockDeep<ExecutionContext>();
    expect(new SessionGuard()).toBeDefined();
  });
});
