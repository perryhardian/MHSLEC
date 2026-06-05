import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AutomationsService } from './automations.service';

@Module({
  imports: [PrismaModule],
  providers: [AutomationsService],
  exports: [AutomationsService],
})
export class AutomationsModule {}
