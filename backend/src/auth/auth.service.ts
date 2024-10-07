import { UserRepository } from '@fred/repositories/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

	constructor(
		private readonly userRepository: UserRepository,
	) {}
	async login(email: string, password: string) {
		const auth = await this.userRepository.verifyPassword(email, password);
		const { success } = auth;
		if (!success) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const {user} = auth;

		const generateAccessToken = jwt.sign({ 
			sub: user.id,
			email: user.email,
			name: user.name,
			age: user.age
		}, process.env.JWT_SECRET, { expiresIn: '1h' });

		return generateAccessToken;
	}
}
