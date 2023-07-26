import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './websocket.gateway';
import { GameSessionService } from './gameSession/gameSessionService';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppGateway, GameSessionService],
})
export class AppModule {}
