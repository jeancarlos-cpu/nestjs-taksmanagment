import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthCreateDto } from './dto/auth-create.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) credentials: AuthCreateDto): Promise<void> {
    return this.authService.signUp(credentials);
  }

  @Post('/login')
  login(@Body(ValidationPipe) credentials: AuthCreateDto): Promise<{}> {
    return this.authService.login(credentials);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
