import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { databaseProviders } from './providers/db-provider';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [],
  providers: [...databaseProviders],
})
export class AppModule {}
