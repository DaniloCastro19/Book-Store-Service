import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/singUp.dto';
import { SingInDto } from './dto/singIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signUp')
  signUp(@Body() signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto;
    return this.authService.signUp(email, password, name);
  }

  @Post('signIn')
  signIn(@Body() signInDto: SingInDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }
}
