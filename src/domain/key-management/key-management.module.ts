import { Module } from '@nestjs/common';
import KeyManagementController from '../../interfaces/key-management/key-management.controller';

@Module({
  controllers: [
    KeyManagementController
  ],
  providers: [],
})
export default class KeyManagementModule {}
