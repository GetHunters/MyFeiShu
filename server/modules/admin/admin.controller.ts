import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AdminLoginRequest, AdminLoginResponse } from '@shared/api.interface';
import { IsString, MinLength } from 'class-validator';

const ADMIN_ACCOUNT = '16637710089';
const ADMIN_PASSWORD = 'zcc100890';

class AdminLoginDto implements AdminLoginRequest {
  @IsString()
  @MinLength(1)
  account!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

@Controller('api/admin')
export class AdminController {
  @Post('login')
  async login(@Body() dto: AdminLoginDto): Promise<AdminLoginResponse> {
    if (dto.account !== ADMIN_ACCOUNT || dto.password !== ADMIN_PASSWORD) {
      throw new UnauthorizedException('账号或密码错误');
    }
    return { success: true };
  }
}
