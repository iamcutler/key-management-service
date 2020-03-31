import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class DecryptDataKeyRequest {
    @ApiProperty({
        description: 'Base64 encoded cipher key'
    })
    @IsString()
    cipherText: string;
}
