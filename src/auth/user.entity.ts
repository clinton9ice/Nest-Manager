import { Exclude } from 'class-transformer';
import { TaskEntity } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_) => TaskEntity, (task) => task.user, { eager: false })
  @Exclude({ toPlainOnly: true })
  tasks: TaskEntity[];
}
