import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { NeedLogin } from '@lark-apaas/fullstack-nestjs-core';
import type { Request } from 'express';
import { ADMIN_USER_ID } from '@server/common/constants/admin-user';
import { SummariesService } from './summaries.service';

@Controller('api/summaries')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @NeedLogin()
  @Get()
  async list(@Req() req: Request) {
    if (req.userContext.userId !== ADMIN_USER_ID) {
      throw new ForbiddenException('仅管理员可查看工作总结');
    }
    return this.summariesService.list();
  }

  @NeedLogin()
  @Get(':id')
  async detail(@Req() req: Request, @Param('id') id: string) {
    if (req.userContext.userId !== ADMIN_USER_ID) {
      throw new ForbiddenException('仅管理员可查看工作总结');
    }
    return this.summariesService.detail(id);
  }
}
