> ❗️ 이 repository는 2021-12 ~ 2022-01 까지 약 한달간 munetic 프로젝트 첫번째 팀으로 참여했을 당시 작성했던 코드를 개인적으로 리팩토링하며 회고하는 repository입니다.

# slabs-munetic

[원본 프로젝트 repository](https://github.com/innovationacademy-kr/slabs-munetic)

42-기업 협력 프로젝트.
Munetic, 음악 레슨 매칭앱의 MVP(Minimum Viable Product)를 3 명씩 구성 된 총 3 개의 개발 팀이 릴레이 방식으로 개발하는 프로젝트입니다.

## 폴더 구조

```bash
├── munetic_admin # client - Munetic admin
├── munetic_app # client - Munetic app
├── munetic_express # server
├── munetic_database # mariadb
└── munetic_proxy # nginx reverse proxy
```

## Installation & Execution

> ❗️ 현재 서버 api 수정 작업 중인 상태로 클라이언트 app과 통신이 정상적으로 수행되지않습니다.. express와 admin만 로컬에서 개별적으로 실행시키는 것을 권장드립니다.

### 1️⃣ 로컬로 실행하는 방법

0. clone후 munetic_admin, munetic_app, munetic_express npm 패키지 설치

1. munetic_admin, munetic_app, munetic_express 안에 .env를 생성하고 환경변수를 설정합니다.

   - munetic_admin / munetic_app env

   ```
   VITE_BASE_URL =http://localhost:3030
   ```

   - munetic_express

   ```bash
   DB_HOST= # MARIADB_HOST (ex.localhost)
   DB_PORT= # MARIADB_PORT (ex.3306)
   DB_USERNAME= # MARIADB_USERNAME (ex. root)
   DB_PASSWORD= # MARIADB_PASSWORD
   DB_NAME= # MARIADB_DATABASE_NAME
   ACCESS_SECRET= # JWT_ACCESS_SECRET_KEY
   REFRESH_SECRET= # JWT_REFRESH_SECRET_KEY
   SERVER_HOST= # (ex.localhost)
   ```

2. Docker로 mariadb 띄우기

   - mariadb 이미지 다운로드

   ```bash
   docker pull mariadb
   ```

   - mariadb 컨테이너 실행 : 환경변수 설정값을 입력

   ```bash
   docker run --name mariadb -d -p DB_PORT:3306 --restart=always -e MYSQL_ROOT_PASSWORD=DB_PASSWORD mariadb
   ```

   - docker mariadb에 접속해 db 생성

   ```bash
   docker exec -it mariadb /bin/bash
   ```

   ```bash
   mysql -u root -pDB_PASSWORD
   create database DB_NAME;
   ```

3. munetic_admin, munetic_app, munetic_express 각각 `npm run dev`로 실행

4. munetic_express seed 추가

```bash
npx sequelize db:seed:all
```

5. 경로 접속

- app => localhost:2424
- admin => localhost:4242/admin
- express => localhost:3030/api
- swagger => localhost:3030/api/swagger

### 2️⃣ 도커 컴포즈로 실행하는 방법

1. root에 위치한 `.env_template` 파일을 통해 .env를 설정합니다.

```bash
MARIADB_USER=# DB_USER_NAME
MARIADB_PASSWORD=# DB_USER PASSWORD
MARIADB_ROOT_PASSWORD=# DB_ROOT_PASSWORD
ACCESS_SECRET=# JWT_ACCESS_SECRET_KEY
REFRESH_SECRET=# JWT_REFRESH_SECRET_KEY
SERVER_HOST=# (ex. localhost)
MODE= # dev || test
```

2. munetic_admin, munetic_app, munetic_express 내에서 `npm i`를 실행하여 package-lock.json파일을 생성합니다.

3. docker-compose 실행

```bash
docker-compose -f docker-compose.yaml -f network-main.yaml up
```

4. localhost:8080, localhost:8080/admin, localhost:8080/api로 확인

## API 명세 확인

express 서버 경로에서 /swagger로 접속

```
ex) localhost:3030/api/swagger
```

## 리팩토링 진행 상황

- [x] 관심사별 객체로 묶어 재사용성 높이기
- [x] Rest API 디자인 가이드에 맞춰 API 개선
- [x] API 수정에 따른 클라이언트(admin) 재연결
- [ ] API 수정에 따른 클라이언트(app) 재연결
- [ ] test coverage 높이기
