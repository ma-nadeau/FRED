import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { User } from '@prisma/client';
export const IS_PUBLIC_KEY = 'isPublic';

export const FredUser = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext): Promise<User> => {
        const request = ctx.switchToHttp().getRequest();
        return request.profile;
    }
);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
