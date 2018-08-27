## Foto Mongo

---
__Docker NodeJs Mongo Demo app__

---

## Instalation

### step 1, install Docker and NPM.

 - [install npm](https://www.npmjs.com/get-npm)
 - [install docker](https://docs.docker.com/install/)

#### (on linux)

 - [install docker-compose](https://docs.docker.com/compose/install/)  

### step 2, install dependencies.

```code
    $ npm install
```

### step 3, copy .env.

```code
    $ cp .env.example .env
```

### step 4, start containers.

```code
    $ docker-compose build
    $ docker-compose up
```

or 

```
    $ npm run serve
```

#### notes

If you have problems with the docker demon, try sudo.

```code
    $ sudo docker-compose build
    $ sudo docker-compose up
```

### step 3, run app.

__ready! the app is running on [`localhost:3000`](localhost:3000)__

***
