Commander.js は、CLI の構造をコードで定義すると、引数・オプションの解析、usage エラー表示、help 表示を面倒見てくれるライブラリです。([GitHub][1])

````md
# Commander.js の基本とサブコマンドの作り方

## Commander.js とは

Commander.js は、Node.js で CLI アプリを作るためのライブラリ。  
CLI の構造をコードで定義すると、主に次のことをやってくれる。

- 引数の解析
- オプションの解析
- usage エラーの表示
- help の表示

公式 README でも、  
「CLI をコードで記述すると、Commander が引数やオプションの解析、usage エラー表示、help システムを面倒見てくれる」  
という説明になっている。

---

## 基本の流れ

Commander.js の基本の流れは次の通り。

1. `Command` インスタンスを作る
2. CLI の名前・説明・バージョンを設定する
3. コマンドやオプションを定義する
4. `parse()` で引数を解析して実行する

### 例

```ts
import { Command } from "commander";

const program = new Command();

program
  .name("tino")
  .description("Issue / Task / Note を扱うローカル管理ツール")
  .version("0.1.0");

program.parse();
````

---

## よく使うメソッド

### `.name()`

CLI のコマンド名を設定する。

```ts
program.name("tino");
```

help に表示される名前にも使われる。

---

### `.description()`

コマンドやプログラムの説明文を設定する。

```ts
program.description("Task を管理する CLI");
```

---

### `.version()`

バージョン情報を設定する。

```ts
program.version("0.1.0");
```

`--version` で表示できるようになる。

---

### `.argument()`

コマンド引数を定義する。

```ts
program.argument("<title>", "Task のタイトル");
```

ただし、サブコマンド構成にしたい場合は、親コマンドにまとめて引数を持たせるより、
各サブコマンドに必要な引数だけ定義する方が自然。

---

### `.option()`

オプションを定義する。

```ts
program.option("-d, --description <description>", "説明");
```

* `-d`: 短い形式
* `--description`: 長い形式
* `<description>`: 値を1つ取る

Commander.js では、認識されないオプションはエラーになる。

---

### `.action()`

コマンド実行時の処理を書く。

```ts
program.action(() => {
  console.log("実行された");
});
```

---

### `.parse()`

CLI 引数を解析して、対応する action を実行する。

```ts
program.parse();
```

引数なしで呼ぶと通常は `process.argv` を解析する。
テストでは `parse([...], { from: "user" })` のように、配列を渡して解析することもできる。

---

## サブコマンドとは

サブコマンドは、`git status` や `npm run` のように
**「対象 + 操作」** の形で CLI を表現する仕組み。

今回の例だと、

* `tino task add`
* `tino task list`

のような形。

Commander.js では、`.command()` を使ってサブコマンドを定義する。

---

## サブコマンドの基本的な作り方

### 例: `tino task add <title>`

```ts
import { Command } from "commander";

const program = new Command();

program
  .name("tino")
  .description("Issue / Task / Note を扱うローカル管理ツール")
  .version("0.1.0");

const task = program
  .command("task")
  .description("Task を操作する");

task
  .command("add <title>")
  .description("Task を追加する")
  .option("-d, --description <description>", "説明")
  .action((title, options) => {
    console.log(`Adding task: ${title}`);

    if (options.description) {
      console.log(`Description: ${options.description}`);
    }
  });

program.parse();
```

---

## この形が自然な理由

`task <cmd>` のように、`cmd` を文字列引数で受けて `if` 分岐する方法もある。
ただ、Commander.js では `task add` のように **サブコマンドとして分ける方が自然**。

### 理由

#### 1. CLI の読み方が自然

* `task` = 対象
* `add` = 操作

という構造になる。

#### 2. コマンドごとに必要な引数を分けられる

たとえば将来こうしやすい。

* `task add <title>`
* `task list`
* `task done <id>`
* `task delete <id>`

#### 3. help が見やすくなる

サブコマンドとして定義すると、Commander.js の help 表示にも構造が反映される。

---

## 実装の考え方

### 悪くないが少し不自然な例

```ts
program
  .command("task")
  .argument("<cmd>")
  .argument("<title>")
  .action((cmd, title) => {
    if (cmd === "add") {
      console.log(title);
    }
  });
```

この形だと、見た目は `task add title` でも、実際には
**task コマンドの引数として add を受け取っているだけ** になる。

そのため、

* `list` では title がいらない
* `done` では id がほしい

のような違いに対応しにくい。

---

### より自然な例

```ts
const task = program.command("task").description("Task を操作する");

task
  .command("add <title>")
  .description("Task を追加する")
  .action((title) => {
    console.log(title);
  });
```

こちらは `add` 自体がコマンドなので、設計として整理しやすい。

---

## コマンド定義と処理は分けてもよい

Commander.js を使っていると、最初は `index.ts` に全部書きがち。
ただ、コマンドが増えてくると、

* コマンド定義
* 実際の処理

を分けた方が見通しがよくなる。

### 例

#### `index.ts`

```ts
import { Command } from "commander";
import { registerTaskCommand } from "./task/command.js";

run();

function run(): void {
  const program = buildProgram();
  program.parse();
}

function buildProgram(): Command {
  const program = new Command();

  program
    .name("tino")
    .description("Issue / Task / Note を扱うローカル管理ツール")
    .version("0.1.0");

  registerTaskCommand(program);

  return program;
}
```

#### `task/command.ts`

```ts
import { Command } from "commander";
import { handleAddTask } from "./action.js";

export function registerTaskCommand(program: Command): void {
  const task = program
    .command("task")
    .description("Task を操作する");

  task
    .command("add <title>")
    .description("Task を追加する")
    .option("-d, --description <description>", "説明")
    .action((title, options) => handleAddTask(title, options.description));
}
```

#### `task/action.ts`

```ts
function handleAddTask(title: string, description?: string) {
  console.log(`Task ${title} を追加します。`);

  if (description) {
    console.log(`Description: ${description}`);
  }
}

export { handleAddTask };
```

---

## 今回学んだポイント

### 1. Commander.js は CLI の構造を定義するライブラリ

引数解析や help 表示を自前で全部書かなくてよい。

### 2. `task add` のようなサブコマンド構成が自然

`task <cmd>` で文字列分岐するより、`.command()` で分けた方がよい。

### 3. コマンドごとに引数やオプションを分けられる

* `add` は `<title>`
* `list` は引数なし
* `done` は `<id>`

のように設計しやすい。

### 4. コマンド定義と処理は分けてよい

CLI の入口、コマンド定義、実際の処理を分けると読みやすくなる。

---

## 今後の自分向けメモ

次に `task list`, `task done`, `task delete` を追加するときは、
`task` の下にサブコマンドを増やしていく。

```ts
task.command("list")
task.command("done <id>")
task.command("delete <id>")
```

今後コマンドが増えたら、`issue`, `note` も同じように

* `registerIssueCommand`
* `registerNoteCommand`

として分けるとよい。

---

## 参考

* Commander.js 公式 README
* Commander.js npm package ページ

````

[1]: https://github.com/tj/commander.js/blob/master/Readme.md "https://github.com/tj/commander.js/blob/master/Readme.md"
