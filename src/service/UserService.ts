import { BadRequestError, InternalServerError, MethodNotAllowedError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm/repository/Repository";
import { User } from "../entity/User";
import { ConflictError } from "../errors/ConflictError";
import { UserRepository } from "../repository/UserRepository";

@Service()
export class UserService {

    @OrmRepository(User)
    private userRepository: Repository<User>;

    public async getOne(id: number): Promise<User> {
        const user =  this.userRepository.findOneById(id);
        if (!user) {throw new NotFoundError("User not found"); }
        return user;
    }
    public async getAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    public async createOne(user: User): Promise<any> {

        /**
         * As the postgres (production) is only supporting "returning" keyword,
         * the insert method is divided to separate cases.
         *
         * DATABASE_URL is the environment variable that Heroku uses for Postgres,
         * so it can be used for defining what database environment is used
         */
        if (process.env.DATABASE_URL) {

            // Use query builder to create insert query returning the id and finding then just created object
            return await this.userRepository.createQueryBuilder()
                .insert().into(User).values(user).returning("id").execute().then((res) => {
                    // tslint:disable-next-line:no-console
                    console.log(res[0]);
                    return this.getOne(res[0].id);
                }).catch((err) => {
                    throw new BadRequestError("Error in the request");
                });
        } else {

            // Use "insert" function for creating and then use Sqlite's "last_insert_rowid()" for finding the new item
            return await this.userRepository.insert(user).then(() => {
                return this.userRepository.query("SELECT last_insert_rowid() as id;");
            }).then((result) => {
                return this.getOne(result[0].id);
            }).catch((err) => {
                throw new BadRequestError("Error in the request");
            });
        }
    }
    public async updateOne(id: number, user: User): Promise<any> {

        // Prevent updating user id
        if (user.id && user.id !== id) {
            throw new ConflictError("id");
        }

        // Check if user with the given id exists
        if (!await this.getOne(id)) { throw new NotFoundError("User not found"); }

        // Update the user with given details
        await this.userRepository.updateById(id, user).catch((err) => {

            // Handle any errors in the update process
            throw new BadRequestError("Error in the request");
        });

        // Return updated user
        return await this.getOne(id);

    }
    public async deleteOne(id: number): Promise<any> {

        // Check if user with the given id exists
        if (!await this.getOne(id)) { throw new NotFoundError("User not found"); }

        // Delete the user with given id
        await this.userRepository.deleteById(id);
    }
}
