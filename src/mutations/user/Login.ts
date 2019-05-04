import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../entities/User';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class LoginResolver {

  @Mutation(() => User, { 
    nullable: true,
    description: 'Log in an user' 
  })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext 
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email }});

    if(!user){
      return null;
    }
    
    const valid = await bcrypt.compareSync(password , user.password);

    if(!valid) {
      return null;
    }

    ctx.req.session!.userId = user.id;

    return user;
    
  }

}