import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  Unique,
  IsUUID,
  Default,
  CreatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  UpdatedAt,
} from 'sequelize-typescript';
import { roomAttributes } from '../types';
import { Users } from './UsersModel';
// import { DataTypes } from 'sequelize';

@Table({
  tableName: 'room',
  timestamps: false,
})
export class Room extends Model<roomAttributes> {
  @PrimaryKey
  @Unique
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  public id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public title: string;

  @Default('defaultCover.jpg')
  @Column({
    type: DataType.STRING,
  })
  public cover: string;

  @Column({ allowNull: false })
  @ForeignKey(() => Users)
  @Column
  ownerId: string;

  @BelongsTo(() => Users)
  owner: Users;

  //   @HasMany(() => Users, 'membersIds')
  //   members: Users[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
