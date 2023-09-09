import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from 'src/address/address.module';
import { Address } from 'src/address/entities/address.entity';
import { HistoricRecover } from 'src/historic-recover/entities/historic-recover.entity';
import { HistoricRecoverModule } from 'src/historic-recover/historic-recover.module';
import { EmailModule } from 'src/mail/mail.module';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { SpecialtyModule } from 'src/specialty/specialty.module';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileEntity,
      HistoricRecover,
      Specialty,
      Address
    ]),
    EmailModule,
    HistoricRecoverModule,
    AddressModule,
    SpecialtyModule

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
