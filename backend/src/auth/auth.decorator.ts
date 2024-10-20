import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDAO } from '@hubber/transfer-objects/daos';

export const FredUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDAO => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Assuming the user object is attached to the request after JWT verification
  },
);
