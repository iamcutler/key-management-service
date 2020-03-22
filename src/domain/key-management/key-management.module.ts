import { Module } from '@nestjs/common';
import KeyManagementController from '../../interfaces/key-management/KeyManagementController';

@Module({
  controllers: [KeyManagementController],
  providers: [],
})
export default class KeyManagementModule {}
