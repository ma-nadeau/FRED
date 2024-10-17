// @ts-ignore
import {
  IsEmail,
  IsString,
  IsInt,
  MinLength,
  IsNotEmpty,
  Min,
} from 'class-validator';
export class RequestLoginDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class ResponseLoginDTO {
  accessToken: string;
}

export class RequestSignupDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age must be a positive number' })
  age: number;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class ResponseSignupDTO {
  message: string;
  accessToken: string;
}
