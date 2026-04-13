import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/singUp.dto';
import { SingInDto } from './dto/singIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('singUp')
  signUp(@Body() singUpDto: SignUpDto) {
    const { email, password, name } = singUpDto;
    return this.authService.signUp(email, password, name);
  }

  @Post('singIn')
  signIn(@Body() singInDto: SingInDto) {
    const { email, password } = singInDto;
    return this.authService.signIn(email, password);
  }
}
