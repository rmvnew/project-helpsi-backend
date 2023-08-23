import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';

export const userProviders = [
  {
    provide: 'dbo',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];