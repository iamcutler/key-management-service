import { Module } from '@nestjs/common';
import CustomerKeyManagementController from '../../interfaces/customerKeyManagement/customerKeyManagement.controller';
import DataKeyManagementController from '../../interfaces/DataKeyManagement/DataKeyManagement.controller';

@Module({
  controllers: [
    CustomerKeyManagementController,
    DataKeyManagementController,
  ],
  providers: [],
})
export default class KeyManagementModule {}
