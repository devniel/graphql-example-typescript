import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  Authorized,
  UseMiddleware,
  Ctx
} from 'type-graphql';

import bcrypt from 'bcrypt';

import { User } from '../../entities/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../../middlewares/isAuth';
import { logger } from '../../middlewares/logger';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class RegisterResolver {

  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello(@Ctx() ctx: MyContext) {
    return `Hello ${ctx.req.session!.user.name}!`;
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
