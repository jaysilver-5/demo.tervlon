import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(['LEARNER', 'INSTRUCTOR', 'HIRING_MANAGER', 'CANDIDATE'])
  role?: 'LEARNER' | 'INSTRUCTOR' | 'HIRING_MANAGER' | 'CANDIDATE';
}