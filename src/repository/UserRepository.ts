import {Service} from "typedi";
import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public findByIdName(firstName: string, lastName: string) {
        return this.findOne({firstName, lastName});
    }

}
