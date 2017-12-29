import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm/repository/Repository";
import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";

@Service()
export class UserService {

    @OrmRepository(User)
    private userRepository: Repository<User>;

    public async getOne(id: number): Promise<User> {
        return this.userRepository.findOneById(id);
    }
    public async getAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    public async createOne(user: User): Promise<void> {
        return this.userRepository.insert(user);
    }
    public async updateOne(id: number, user: User): Promise<void> {
        return this.userRepository.updateById(id, user);
    }
    public async deleteOne(id: number): Promise<void> {
        return this.userRepository.deleteById(id);
    }
}
