import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";
import { AppModule } from "./../src/app.module";
import { AuthDto, TokenDto } from "../src/auth/dto";
import { PrismaService } from "../src/prisma/prisma.service";
import { LoginDto } from "../src/auth/dto/login.dto";
import { UpdateUserDto } from "../src/user/dto/updateUser.dto";
import { CreatePostDto } from "../src/post/dto";


describe("CatBlog", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();


    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);

    await prisma.$transaction([
      prisma.post.deleteMany(),
      prisma.user.deleteMany()
    ]);
    pactum.request.setBaseUrl("http://localhost:3333");
  });
  afterAll(async () => {
    await app.close();
  });

  describe("Auth", () => {
    describe("Register", () => {
      it("should throw an error if some of user credentials are empty or wrong", () => {
        const badDto = {
          surname: "Vomáčka",
          email: "test@gmail",
          password: "rožok"
        };

        return pactum.spec().post("http://localhost:3333/auth/register").withBody(badDto).expectStatus(400);
      });
      it("should throw an error if no body is passed", () => {
        return pactum.spec().post("http://localhost:3333/auth/register").expectStatus(400);

      });
      it("should register a new user", () => {
        const dto: AuthDto = {
          name: "Tomáš",
          surname: "Vostárek",
          email: "test@gmail.com",
          password: "rožok"
        };

        return pactum.spec().post("/auth/register").withBody(dto).expectStatus(201);
      });
    });
    describe("Login", () => {
      it("should throw error if email or password is wrong", () => {
        const badDto: LoginDto = {
          email: "test@gmail.com",
          password: "papagaj"
        };

        return pactum.spec().post("http://localhost:3333/auth/login").withBody(badDto).expectStatus(403);
      });
      it("should throw an error if no body is passed", () => {
        return pactum.spec().post("http://localhost:3333/auth/login").expectStatus(400);

      });
      it("should login user", () => {
        const dto: LoginDto = {
          email: "test@gmail.com",
          password: "rožok"
        };

        return pactum.spec().post("http://localhost:3333/auth/login").withBody(dto).expectStatus(200).stores("userAccessToken", "access_token").stores("userRefreshToken", "refresh_token");
      });
    });
    describe("Get new access token", () => {
      it("should throw 401 Unauthorized if no refresh token is provided or is expired", () => {
        return pactum.spec().post("http://localhost:3333/auth/token").withHeaders({
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidm9qaXJAc2QuY3oiLCJpYXQiOjE2NjQ3OTY4NTUsImV4cCI6MTY2NDc5ODA1NX0.dyFP2TyOEfdi8xTO9r7DGneoejEX3Qun3NKsPIU_kWM"
        }).expectStatus(401);
      });
      it("should retrieve access token with refresh token", () => {
        return pactum.spec().post("http://localhost:3333/auth/token").withHeaders({
          Authorization: "Bearer $S{userRefreshToken}"
        }).expectStatus(200);
      });
    });
  });
  describe("Posts", () => {
    describe("Create post", () => {
      const createPostDto: CreatePostDto = {
        title: "TOP 10 things about cats",
        content: "No.1 cats are super cute!"
      };

      it("Should create post", () => {
        return pactum.spec().post("/posts").withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).withBody({
          ...createPostDto
        }).expectStatus(201).stores("postId", "id");
      });
    });
    describe("Update post", () => {
      it("should update post that user have access to", () => {
        return pactum.spec().put("/posts/{id}").withPathParams("id", "$S{postId}").withBody({
          isPublished: true
        }).withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(200);
      });

      it("should throw 401 unauthorized if the access token is invalid", () => {
        return pactum.spec().put("/posts/{id}").withPathParams("id", "$S{postId}").withBody({
          isPublished: true
        }).withHeaders({
          Authorization: "Bearer "
        }).expectStatus(401);
      });

      it("should throw 403 forbidden if post id id invalid", () => {
        return pactum.spec().put("/posts/{id}").withPathParams("id", "wrongId").withBody({
          isPublished: true
        }).withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(403);
      });
    });
    describe("Get all posts", () => {
      it("should get all posts that are published", () => {
        return pactum.spec().get("/posts").expectStatus(200);
      });
    });
    describe("Get post by ID", () => {
      it("should get post that is published by id", () => {
        return pactum.spec().get("/posts/{id}/").withPathParams("id", "$S{postId}").expectStatus(200);
      });
      it("should throw 404 exception if post ID is wrong or post is marked as not published", () => {
        return pactum.spec().get("/posts/trouba").expectStatus(404);
      });
    });
    describe("Get user posts", () => {
      it("should return all users posts whether they have been published or not.", () => {

        return pactum.spec().get("/users/posts").withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(200);
      });
      it("should throw error if access token is not provided", () => {
        return pactum.spec().put("/users/posts").expectStatus(404);
      });
      it("should throw error if access token is expired", () => {
        return pactum.spec().put("/users/posts").withHeaders({
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidm9qaXJAc2QuY3oiLCJpYXQiOjE2NjQ3OTY4NTUsImV4cCI6MTY2NDg1Njc5NX0.Fcvfq2YBZL6z2mYCCWMcE-Oqw773jE1BH422D4cxGlk"
        }).expectStatus(404);
      });
    });
    describe("Get user post by ID", () => {
      it("should return users post whether they have been published or not", () => {
        return pactum.spec().get("/users/posts/{id}").withPathParams("id", "$S{postId}").withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(200);
      });
      it("should throw 401 unauthorized if access token is invalid", () => {
        return pactum.spec().get("/users/posts/{id}").withPathParams("id", "$S{postId}").withHeaders({
          Authorization: "Bearer "
        }).expectStatus(401);
      });

      it("should throw 404 Not Found if post ID is invalid", () => {
        return pactum.spec().get("/users/posts/{id}").withPathParams("id", "wrongID").withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(404);
      });
    });
    describe("Delete post by ID", () => {
      it("should throw 401 unauthorized if access token is invalid", () => {
        return pactum.spec().delete("/posts/{id}").withPathParams("id", "$S{postId}").withHeaders({
          Authorization: "Bearer "
        }).expectStatus(401);
      });
      it("should throw 403 forbidden if post ID is invalid", () => {
        return pactum.spec().delete("/posts/{id}").withPathParams("id", "wrongID").withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(403);
      });
      it("should delete post by ID", () => {
        return pactum.spec().delete("/posts/{id}").withPathParams("id", "$S{postId}").withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(200);
      });

    });
  });
  describe("Users", () => {
    describe("Get current user", () => {
      it("should throw 401 Unauthorized if no token is provided", () => {
        return pactum.spec().get("/users/me").expectStatus(401);
      });
      it("should return current user profile", () => {
        return pactum.spec().get("/users/me").withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(200);
      });
    });
    describe("Update user credentials", () => {
      it("should update user verified by access token", () => {
        const updateUserDto: UpdateUserDto = {
          name: "Libor",
          surname: "Fiala"
        };
        return pactum.spec().put("/users").withBody({
          ...updateUserDto
        }).withHeaders({
          Authorization: "Bearer $S{userAccessToken}"
        }).expectStatus(200);
      });
      it("should throw 401 unauthorized if access token is invalid", () => {
        const updateUserDto: UpdateUserDto = {
          name: "Libor",
          surname: "Fiala"
        };
        return pactum.spec().put("/users").withBody({
          ...updateUserDto
        }).withHeaders({
          Authorization: "Bearer "
        }).expectStatus(401);
      });
    });

  });
});


/* describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
*/