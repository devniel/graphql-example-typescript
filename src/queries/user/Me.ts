import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../../entities/User';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class MeResolver {

  @Query(() => User, { 
    nullable: true,
    description: 'Returns the current logged user.'
  })
  async me(@Ctx() ctx: MyContext) : Promise<User | undefined> {
    if(!ctx.req.session!.userId) {
      return undefined;
    }

    return User.findOne(ctx.req.session!.userId);
  }

}