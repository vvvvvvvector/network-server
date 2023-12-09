import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ROUTES, SWAGGER_API_TAGS } from 'src/utils/constants';

import { ProfilesService } from './profiles.service';

import { UploadAvatar } from './decorators/upload-avatar.decorator';

import { UpdateBioDto } from './dtos/bio.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(SWAGGER_API_TAGS.PROFILES)
@Controller(ROUTES.PROFILES)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Put('/bio')
  async updateBio(@Req() req, @Body() dto: UpdateBioDto) {
    return this.profilesService.updateBio(req.user.id, dto.bio);
  }

  @Post('/avatar')
  @UploadAvatar()
  async uploadAvatar(
    @Req() req,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.profilesService.saveAvatar(req.user.id, file.filename);
  }

  @Put('/avatar')
  @UploadAvatar()
  async updateAvatar(
    @Req() req,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.profilesService.updateAvatar(req.user.id, file.filename);
  }

  @Delete('/avatar')
  async removeAvatar(@Req() req) {
    return this.profilesService.removeAvatar(req.user.id);
  }
}

// new ParseFilePipeBuilder()
// .addFileTypeValidator({
//   fileType: new RegExp('.(png|jpeg|jpg)'),
// })

// .addMaxSizeValidator({
//   message: 'Please upload a file less than 1MB',
//   maxSize: 1024 * 1024 * 1,
// })

// .build({
//   errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
// }),
