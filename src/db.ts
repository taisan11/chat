import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node'

// データベースのスキーマを定義
export interface DbSchema {
  posts: Array<{ name: string; ms: string;}>;
}

// JSONファイルを使ったアダプタの作成id
const adapter = new JSONFile<DbSchema>('db.json');
const db = new Low<DbSchema>(adapter,  { posts: [],});

// データベースを初期化する非同期関数
const initializeDb = async () => {
  await db.read();
  // デフォルト値を設定
  db.data ||= { posts: []};
  await db.write();
}
//@ts-ignore
await initializeDb();

export const createPost = async (name: string,ms:string) => {
	await db.update(({posts}) => posts.push({ name:name,ms:ms }))
}
export const getPosts = async () => {
  await db.read();
  return db.data.posts
}
