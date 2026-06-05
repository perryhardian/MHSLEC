import { Module } from '@nestjs/common';
import { AutomationsModule } from '../automations/automations.module';
import { SavingsGoalsController } from './savings-goals.controller';
import { SavingsGoalsService } from './savings-goals.service';

@Module({
  imports: [AutomationsModule],
  controllers: [SavingsGoalsController],
  providers: [SavingsGoalsService],
  exports: [SavingsGoalsService],
})
export class SavingsGoalsModule {}
