import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(data: {
    email: string;
    username: string;
    password: string;
    role?: 'LEARNER' | 'INSTRUCTOR' | 'HIRING_MANAGER' | 'CANDIDATE';
  }) {
    // Check if email or username already exists
    const existingEmail = await this.userService.findByEmail(data.email);
    if (existingEmail) throw new ConflictException('Email already registered');

    const existingUsername = await this.userService.findByUsername(data.username);
    if (existingUsername) throw new ConflictException('Username already taken');

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await this.userService.create({
      email: data.email,
      username: data.username,
      passwordHash,
      role: data.role || 'LEARNER',
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Store hashed refresh token
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, hashedRefresh);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email);

    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, hashedRefresh);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenValid) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateTokens(user.id, user.email);

    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, hashedRefresh);

    return tokens;
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '15m' as const,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d' as const,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}