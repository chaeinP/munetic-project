import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface lessonAttributes {
  id: number;
  tutor_id: number;
  category_id: number;
  title: string;
  price: number | null;
  location: string;
  minute_per_lesson: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type lessonCreationAttributes = Optional<
  lessonAttributes,
  'title' | 'price' | 'location' | 'minute_per_lesson' | 'content'
>;

export default class Lesson
  extends Model<lessonAttributes, lessonCreationAttributes>
  implements lessonAttributes
{
  public id!: number;
  public tutor_id!: number;
  public category_id!: number;
  public title!: string;
  public price!: number | null;
  public location!: string;
  public minute_per_lesson!: number | null;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Lesson {
    return Lesson.init(
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        tutor_id: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        category_id: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        title: {
          allowNull: false,
          type: DataTypes.STRING(128),
        },
        price: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        location: {
          allowNull: false,
          type: DataTypes.STRING(128),
        },
        minute_per_lesson: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        content: {
          allowNull: false,
          type: DataTypes.STRING(8192),
        },
        createdAt: {
          field: 'createdAt',
          type: DataTypes.DATE,
        },
        updatedAt: {
          field: 'updatedAt',
          type: DataTypes.DATE,
        },
        deletedAt: {
          field: 'deletedAt',
          type: DataTypes.DATE,
        },
      },
      { tableName: 'Lesson', sequelize },
    );
  }
}
