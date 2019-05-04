import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  Authorized,
  UseMiddleware,
} from 'type-graphql';

import bcrypt from 'bcrypt';

import { User } from '../../entities/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../../middlewares/isAuth';
import { logger } from '../../middlewares/logger';

@Resolver()
export class RegisterResolver {

  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Mutation(() => User, {
    description: 'Register a new user'
  })
  async register(@Arg('data')
  {
    email,
    firstName,
    lastName,
    password,
  }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}
