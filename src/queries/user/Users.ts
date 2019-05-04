import { Resolver, Query, Arg, Ctx } from 'type-graphql';
import { User } from '../../entities/User';
import { MyContext } from '../../types/MyContext';

@Resolver()
export default class UsersResolver {

  @Query(() => [User], {
    description: "Returns the list of users."
  })
  async users(
    @Ctx() ctx: MyContext 
  ): Promise<User[] | null> {
    const users = await User.find();
    return users;
  }

}