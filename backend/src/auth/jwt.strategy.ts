import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // If you're using ConfigService for environment variables

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // You can set this to true if you don't want to validate expiration
      secretOrKey: configService.get<string>('JWT_SECRET'), // Ensure JWT_SECRET is defined in your environment
    });
  }

  // This will add the validated user to the request object
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}