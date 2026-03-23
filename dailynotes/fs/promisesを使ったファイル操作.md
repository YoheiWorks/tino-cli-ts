もちろん。
今の CLI 実装の文脈で、`readFile` と `writeFile` の**使い方**と**注意点**を整理すると、まずはこれを押さえれば十分です。

## 使い方

### import

Promise ベースで使うなら `node:fs/promises` から import します。Node.js の `fs` ドキュメントでは Promises API が用意されていて、`readFile` / `writeFile` を Promise として使えます。([Node.js][1])

```ts
import { readFile, writeFile } from 'node:fs/promises'
```

### `readFile`

ファイルを読むときは、文字列として欲しいならエンコーディングを指定します。

```ts
const raw = await readFile('tasks.json', 'utf-8')
```

* `'utf-8'` を指定すると文字列で受け取れます。
* 指定しないと `Buffer` になるので、JSON を読む用途では文字列指定が分かりやすいです。`fs.readFile()` はパスとエンコーディングを受け取る形で紹介されています。([Node.js][2])

JSON を読むなら、そのあと `JSON.parse` します。

```ts
const raw = await readFile('tasks.json', 'utf-8')
const tasks = JSON.parse(raw)
```

### `writeFile`

ファイルに保存するときは、書き込む内容を文字列で渡します。

```ts
await writeFile('tasks.json', 'hello', 'utf-8')
```

JSON を保存するなら `JSON.stringify` してから書きます。Node.js の Learn でも、ファイルを書く最も簡単な方法として `writeFile()` が紹介されています。([Node.js][3])

```ts
await writeFile('tasks.json', JSON.stringify(tasks, null, 2), 'utf-8')
```

---

## いまの用途での基本形

```ts
import { readFile, writeFile } from 'node:fs/promises'

type Task = {
  id: string
  title: string
  done: boolean
}

export async function loadTasks(): Promise<Task[]> {
  const raw = await readFile('tasks.json', 'utf-8')
  return JSON.parse(raw) as Task[]
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await writeFile('tasks.json', JSON.stringify(tasks, null, 2), 'utf-8')
}
```

---

## 注意点

### 1. JSON はそのまま保存されない

`writeFile` は**文字列やバイト列を書くAPI**です。
なので、配列やオブジェクトをそのまま渡すのではなく、`JSON.stringify` が必要です。読むときは逆に `JSON.parse` が必要です。([Node.js][1])

### 2. `readFile` はファイルがなければ失敗する

存在しないパスに対する `fs` 操作では、`ENOENT` という system error が出ることがあります。Node.js の Errors ドキュメントでは、`ENOENT` は “No such file or directory” を表す common system error と説明されています。([Node.js][4])

そのため、初回実行で `tasks.json` がまだ無い場合は `try/catch` で吸収する形がよくあります。

```ts
export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await readFile('tasks.json', 'utf-8')
    return JSON.parse(raw) as Task[]
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return []
    }
    throw error
  }
}
```

### 3. 事前に存在確認しすぎない

Node.js の `fs` ドキュメントでは、先に `access()` などで確認してから開くより、**直接操作してエラーを処理する**方が推奨される場面があります。事前確認と実行の間に状態が変わる race condition を避けるためです。([Node.js][1])

### 4. `readFile` / `writeFile` は「丸ごと読む・丸ごと書く」

この2つは扱いやすいですが、**ファイル全体を対象にする**APIです。
小さい JSON ファイルには向いていますが、大きいファイルやストリーム処理には向きません。Node.js には別途 stream API があります。([Node.js][5])

### 5. `await` を忘れない

`node:fs/promises` は Promise ベースです。`readFile()` や `writeFile()` は Promise を返すので、`async / await` か `.then()` で扱います。Node.js の Promise 学習ページでも、ファイル操作を Promise と `async/await` で扱う例が示されています。([Node.js][6])

---

## いまのCLI用途なら、まず覚えること

* 読む: `await readFile(path, 'utf-8')`
* 書く: `await writeFile(path, text, 'utf-8')`
* JSON保存: `JSON.stringify`
* JSON読込: `JSON.parse`
* ファイル未作成時: `ENOENT` を考える

この5つでかなり十分です。

必要なら次に、これをそのまま Qiita に貼りやすい**見出し付きの技術メモ形式**に整えます。

[1]: https://nodejs.org/api/fs.html?utm_source=chatgpt.com "File system | Node.js v25.8.1 Documentation"
[2]: https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs?utm_source=chatgpt.com "Reading files with Node.js"
[3]: https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs?utm_source=chatgpt.com "Writing files with Node.js"
[4]: https://nodejs.org/api/errors.html?utm_source=chatgpt.com "Errors | Node.js v25.8.1 Documentation"
[5]: https://nodejs.org/api/stream.html?utm_source=chatgpt.com "Stream | Node.js v25.8.1 Documentation"
[6]: https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs?utm_source=chatgpt.com "Discover Promises in Node.js"
