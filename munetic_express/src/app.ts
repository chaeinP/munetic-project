import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { options } from './swagger/swagger';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { router } from './routes';
import { createCategories, createFirstOwnerAccount, Models } from './models';
import errorHandler from './utils/errorHandler';

const app: express.Application = express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:2424', 'http://localhost:4242'],
    credentials: true,
    exposedHeaders: 'Authorization',
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api', router);

/**
 * Swagger 연결
 */
const specs = swaggerJSDoc(options);
app.use(
  '/api/swagger',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true }),
);

/**
 * MariaDB 테이블 연결
 */
Models()
  .sync({ force: true })
  .then(() => {
    app.emit('dbconnected');
    console.log('👍 Modeling Successed');

    // admin Owner 계정 자동 생성
    createFirstOwnerAccount();
    // app category 자동 생성
    createCategories();
  })
  .catch(err => console.log(err, '🙀 Modeling Failed'));

/**
 * 에러 핸들링
 */
app.use(errorHandler);
export default app;
