import { ApiProperty } from '@nestjs/swagger';

export default class DecryptDataKeyRequest {
    @ApiProperty({
        description: 'Base64 encoded cipher key'
    })
    cipherText: string;
}
