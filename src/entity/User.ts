import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("account")
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @Column()
    public age: number;

}
