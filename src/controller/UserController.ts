import { Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put } from "routing-controllers";
import { Inject } from "typedi";
import {User} from "../entity/User";
import { UserService } from "../service/UserService";

@JsonController("/users")
export class UserController {

    @Inject()
    private userService: UserService;

    @Get("/")
    @HttpCode(200)
    public async getAll(): Promise<User[]> {
        return await this.userService.getAll();
    }

    @Get("/:id")
    @HttpCode(200)
    public async getOne( @Param("id") id: number): Promise<User> {
        return await this.userService.getOne(id);
    }

    @Post("/")
    @HttpCode(201)
    public async post( @Body() user: User): Promise<void> {
        return await this.userService.createOne(user);
    }

    @Put("/:id")
    @HttpCode(200)
    public async put( @Param("id") id: number, @Body() user: User): Promise<User> {
        return await this.userService.updateOne(id, user);
    }

    @Delete("/:id")
    @OnUndefined(202)
    public async remove( @Param("id") id: number): Promise<void> {
        return await this.userService.deleteOne(id);
    }
}
