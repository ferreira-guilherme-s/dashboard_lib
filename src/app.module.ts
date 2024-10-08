import { Module } from '@nestjs/common';
import { DashboardService } from './services/DashboardService';

@Module({
  imports: [],
  controllers: [],
  providers: [DashboardService],
})
export class AppModule {}
