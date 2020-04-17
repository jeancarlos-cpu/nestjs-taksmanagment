import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCreateDto } from './dto/auth-create.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp({ username, password }: AuthCreateDto): Promise<void> {
    const user = new User();
    user.username = username;
    user.password = password;

    try {
      await user.save();
    } catch (error) {
      throw new ConflictException();
    }

    return;
  }

  async login({ username, password }: AuthCreateDto): Promise<{}> {
    const user = await this.userRepository.findOne({ username });

    if (!(user && (await user.checkPassword(password)))) {
      throw new NotFoundException();
    }

    const payload = { username };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      token: accessToken,
    };
  }
}
