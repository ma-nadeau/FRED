import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequestLoginDTO, ResponseLoginDTO } from '@hubber/transfer-objects/dtos/auth';
import { AuthService } from './auth.service';
import { FredUser, Public } from 'src/session/auth.decorator';
import { UserDAO } from '@hubber/transfer-objects/daos';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/login')
    @Public()
    async login(@Body() loginDto: RequestLoginDTO): Promise<ResponseLoginDTO> {
        const { email, password } = loginDto;
        return {
            accessToken: await this.authService.login(email, password)
        };
    }

    @Get('/me')
    async me(@FredUser() user: UserDAO): Promise<UserDAO> {
        return user
    }
}
