import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { CreatePostDto } from "./dto";
import { PostService } from "./post.service";

describe('PostController', () => {
  let postController: PostController;
  let postService : PostService;

  let requestMock = {} as unknown as CreatePostDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostController],
    }).compile();
    postController = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });


});