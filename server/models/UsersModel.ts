import {
  Table,
  Model,
  Column,
  DataType,
  Unique,
  Default,
  PrimaryKey,
  IsUUID,
  Length,
  IsEmail,
  DefaultScope,
  BeforeUpdate,
  BeforeCreate,
} from 'sequelize-typescript';

import { hashPassword } from '../utils/authHelpers';

enum userRoles {
  user = 'user',
  admin = 'admin',
}

@DefaultScope(() => ({
  attributes: { exclude: ['active'] },
}))
@Table({
  timestamps: false,
  tableName: 'users',
})
export class Users extends Model {
  @PrimaryKey
  @Unique
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  public id!: string;

  @PrimaryKey
  @Unique
  @IsEmail
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Default('default.jpg')
  @Column({
    type: DataType.STRING,
  })
  photo!: string;

  @Default('user')
  @Column({
    type: DataType.ENUM(...Object.values(userRoles)),
  })
  role!: string;

  @Length({ min: 8, msg: 'Password must be more than 8 chars' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Length({ min: 8 })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordConfirm!: string;

  @Column({
    type: DataType.DATE,
  })
  passwordChangedAt!: Date;

  @Column({
    type: DataType.STRING,
  })
  passwordResetToken!: string;

  @Column({
    type: DataType.DATE,
  })
  passwordResetExpires!: Date;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  active!: Boolean;

  @BeforeUpdate
  @BeforeCreate
  static async hashPassowordModel(instance: Users) {
    if (instance.changed('password')) {
      console.log('Hook');
      instance.password = instance.passwordConfirm = await hashPassword(
        instance.password
      );
    }
  }
}
