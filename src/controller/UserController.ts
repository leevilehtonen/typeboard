import { Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { Inject } from "typedi";
import {User} from "../entity/User";
import { UserService } from "../service/UserService";

@JsonController("/users")
export class UserController {

    @Inject()
    private userService: UserService;

    @Get("/")
    public async getAll(): Promise<User[]> {
        return await this.userService.getAll();
    }

    @Get("/:id")
    public async getOne( @Param("id") id: number): Promise<User> {
        return await this.userService.getOne(id);
    }

    @Post("/")
    public async post( @Body() user: User): Promise<void> {
        return await this.userService.createOne(user);
    }

    @Put("/:id")
    public async put( @Param("id") id: number, @Body() user: User): Promise<void> {
        return await this.userService.updateOne(id, user);
    }

    @Delete("/:id")
    public async remove( @Param("id") id: number): Promise<void> {
        return await this.userService.deleteOne(id);
    }
}
