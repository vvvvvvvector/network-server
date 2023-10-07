import {
  Controller,
  Delete,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Routes, SwaggerApiTags } from 'src/utils/constants';
import { ProfilesService } from './profiles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from './storage';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(SwaggerApiTags.PROFILES)
@Controller(Routes.PROFILES)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post('/upload-avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: avatarStorage,
    }),
  )
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.profilesService.saveAvatar(req.user.uuid, file.filename);
  }

  @Post('/update-avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: avatarStorage,
    }),
  )
  async updateAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.profilesService.updateAvatar(req.user.uuid, file.filename);
  }

  @Delete('/remove-avatar')
  async removeAvatar(@Req() req) {
    return this.profilesService.removeAvatar(req.user.uuid);
  }
}
