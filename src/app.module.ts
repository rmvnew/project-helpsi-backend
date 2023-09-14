import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { Bootstrap } from './config/bootstrap';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from './config/environments/config.module';
import { SwaggerModule } from './config/swagger/swagger.module';
import { DiaryEntryModule } from './diary_entry/diary_entry.module';
import { HistoricRecoverModule } from './historic_recover/historic-recover.module';
import { EmailModule } from './mail/mail.module';
import { PatientDetailsModule } from './patient_details/patient_details.module';
import { ProfileModule } from './profile/profile.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { SpecialtyModule } from './specialty/specialty.module';
import { UserModule } from './user/user.module';
import { UnavailableTimesModule } from './unavailable-times/unavailable-times.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    UserModule,
    DatabaseModule,
    SwaggerModule,
    ProfileModule,
    EmailModule,
    HistoricRecoverModule,
    AddressModule,
    SpecialtyModule,
    PatientDetailsModule,
    DiaryEntryModule,
    SchedulingModule,
    UnavailableTimesModule
  ],
  controllers: [],
  providers: [

    Bootstrap,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }

  ],
})
export class AppModule { }
