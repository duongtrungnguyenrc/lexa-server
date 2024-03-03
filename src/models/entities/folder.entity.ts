import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Folder {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => Folder)
    @JoinColumn()
    root: Folder;
}
