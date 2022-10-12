export class CommentDto {
  id?: string;
  content:string;
  postId: string;
  parentId?:string;
  createdAt?:string;
}