import { Sequelize } from 'sequelize';
import { Category } from './category';
import { Lesson } from './lesson';
import { User, Gender, Account } from './user';
import * as UserService from '../service/user.service';
import * as CategoryService from '../service/category.service';
import { categoryLists } from '../data/categoryList';

const { development } = require('../config/config');
const { host, port, database, username, password } = development;
export const sequelize = new Sequelize(database!, username!, password, {
  host,
  port,
  dialect: 'mariadb',
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true,
  },
  timezone: '+09:00',
  define: {
    timestamps: true,
    deletedAt: true,
    paranoid: true,
  },
});

sequelize
  .authenticate()
  .then(() => console.log('db connected🚀'))
  .catch(err => {
    console.log(host);
    console.log('db connection failed🙀', err);
  });

export function Models() {
  Category.initModel(sequelize);
  User.initModel(sequelize);
  Lesson.initModel(sequelize);

  Category.hasMany(Lesson);
  Lesson.belongsTo(Category, {
    foreignKey: {
      name: 'category_id',
      allowNull: false,
    },
  });
  User.hasMany(Lesson);
  Lesson.belongsTo(User, {
    foreignKey: {
      name: 'tutor_id',
      allowNull: false,
    },
  });
  return sequelize;
}
export function createFirstOwnerAccount() {
  const admin = {
    login_id: 'munetic@gmail.com',
    login_password:
      '$2b$10$9ZgatOfeQp5Di8QLo21ODuOFjrm1/zKwgOkJIPD7Yu0Ws.opQTeqK',
    name: '대표님',
    nickname: 'munetic@gmail.com',
    birth: new Date(),
    gender: Gender.Other,
    type: Account.Owner,
    email: 'munetic@gmail.com',
  };

  UserService.createUser(new User({ ...admin })).then(() =>
    console.log('👑 Admin:First Owner account created'),
  );
}

export function createCategories() {
  categoryLists.map(category => {
    CategoryService.createUser(new Category({ ...category })).catch(e =>
      console.log(e),
    );
  });
  console.log('🎼 App:CategoryLists created');
}
