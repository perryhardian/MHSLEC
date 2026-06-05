import { Module } from '@nestjs/common';
import { AutomationsModule } from '../automations/automations.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AutomationsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
