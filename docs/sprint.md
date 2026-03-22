# 8スプリント概要

| Sprint | テーマ | 成果物 |
| --- | --- | --- |
| 1 | 最小CLIと型の土台 | task add/list/done/delete |
| 2 | issue / task / note へ拡張 | item種別対応CLI |
| 3 | 更新・検索・フィルタ・ソート | 実用CLI |
| 4 | 外部入力の検証 | import/config対応 |
| 5 | エラー設計と状態遷移 | 不正入力・不正遷移対応 |
| 6 | 抽象化とレイヤ分離 | repository/service整理 |
| 7 | 品質強化 | test/export/formatter |
| 8 | 仕上げ | 最終版CLI + README |

---

## Sprint 1: 最小CLIと型の土台

### Day 1

- [x]  Node/TSプロジェクト作成
- [x]  `package.json`, `tsconfig.json`, 実行script追加
- [ ]  `src/types`, `src/commands`, `src/storage` 作成
- [ ]  `tsc` と実行確認

### Day 2

- [ ]  `Task`, `TaskStatus` 型作成
- [ ]  `id`, `title`, `done`, `createdAt`, `updatedAt` 定義
- [ ]  サンプルTaskを1件作る

### Day 3

- [ ]  `loadTasks`, `saveTasks` 実装
- [ ]  JSONファイルがなければ空配列扱い
- [ ]  保存/再読込確認

### Day 4

- [ ]  `task add` 実装
- [ ]  title引数を受け取る
- [ ]  Task生成→保存まで通す

### Day 5

- [ ]  `task list` 実装
- [ ]  一覧整形表示
- [ ]  0件/複数件確認

### Day 6

- [ ]  `task done` 実装
- [ ]  `task delete` 実装
- [ ]  存在しないID時の挙動確認

### Day 7

- [ ]  コード整理
- [ ]  READMEに起動方法とコマンド例追記
- [ ]  add/list/done/delete 通し確認

---

## Sprint 2: issue / task / note へ拡張

### Day 1

- [ ]  `BaseItem` と `ItemType` 設計
- [ ]  共通項目と固有項目を書き出す

### Day 2

- [ ]  `TaskItem`, `IssueItem`, `NoteItem` 型作成
- [ ]  `Item = ...` の discriminated union 化

### Day 3

- [ ]  `item add --type ...` 実装
- [ ]  task/issue/note を作り分ける

### Day 4

- [ ]  `item list` に置換
- [ ]  `-type` フィルタ導入

### Day 5

- [ ]  `item delete` を全type対応にする
- [ ]  ID共通削除を確認

### Day 6

- [ ]  optional/nullable見直し
- [ ]  noteに不要なフィールドを削る

### Day 7

- [ ]  README更新
- [ ]  サンプルデータ作成
- [ ]  add/list/delete を通す

---

## Sprint 3: 更新・検索・フィルタ・ソート

### Day 1

- [ ]  `UpdateItemInput` 設計
- [ ]  `ListQuery` 設計
- [ ]  更新可能項目を固定

### Day 2

- [ ]  `item update` 実装
- [ ]  title/description/tags 更新

### Day 3

- [ ]  `item done` / `item reopen` 実装
- [ ]  task/issue 限定で使えるようにする

### Day 4

- [ ]  type/status/tag/filter 実装
- [ ]  keyword search 実装

### Day 5

- [ ]  `sort` 実装
- [ ]  `updatedAt`, `createdAt`, `priority` など対応

### Day 6

- [ ]  list に filter/sort を統合
- [ ]  `Partial`, `Pick`, `Omit` 使用箇所整理

### Day 7

- [ ]  README更新
- [ ]  query例を追加
- [ ]  update/list/done/reopen を確認

---

## Sprint 4: 外部入力の検証

### Day 1

- [ ]  外部入力境界を洗い出す
- [ ]  import/config/save file を `unknown` 扱いにする方針を決める

### Day 2

- [ ]  import JSON仕様決定
- [ ]  persistence型を設計

### Day 3

- [ ]  type guard または zod を導入
- [ ]  item配列の検証を書く

### Day 4

- [ ]  `item import --file ...` 実装
- [ ]  正常/異常データで確認

### Day 5

- [ ]  config型を作る
- [ ]  config読込で保存先切替対応

### Day 6

- [ ]  通常ロードにも検証を入れる
- [ ]  壊れたJSONの扱い整理

### Day 7

- [ ]  README更新
- [ ]  import/configサンプル追加
- [ ]  `any` が残っていないか確認

---

## Sprint 5: エラー設計と状態遷移

### Day 1

- [ ]  エラー種類を決める
- [ ]  `NotFoundError`, `ValidationError`, `InvalidTransitionError` など定義

### Day 2

- [ ]  custom error class 実装
- [ ]  既存エラー箇所を置き換え

### Day 3

- [ ]  status遷移ルールを決める
- [ ]  `canTransition` 相当関数を作る

### Day 4

- [ ]  done/reopenに遷移ルール適用
- [ ]  completedAt更新ルール追加

### Day 5

- [ ]  `update --status` にも制約を適用
- [ ]  noteへの不正操作を防ぐ

### Day 6

- [ ]  CLI側でのエラー表示を整理
- [ ]  user向けの意味あるメッセージにする

### Day 7

- [ ]  状態遷移表をREADMEに書く
- [ ]  主要異常系の手動確認

---

## Sprint 6: 抽象化とレイヤ分離

### Day 1

- [ ]  現状の責務棚卸し
- [ ]  commandに入りすぎたロジックを洗う

### Day 2

- [ ]  `ItemRepository` interface 作成
- [ ]  必要メソッドを定義

### Day 3

- [ ]  `ItemService` 作成
- [ ]  add/update/delete/done/reopen を移動

### Day 4

- [ ]  `loadJson<T>()`, `saveJson<T>()` など generic helper 作成

### Day 5

- [ ]  formatter を command から分離
- [ ]  output責務を薄く切り出す

### Day 6

- [ ]  `domain/`, `service/`, `repository/`, `cli/`, `lib/` へ整理

### Day 7

- [ ]  全コマンド再確認
- [ ]  READMEにディレクトリ構成追記

---

## Sprint 7: 品質強化

### Day 1

- [ ]  テスト対象を列挙
- [ ]  domain/service/formatterの優先順位を決める

### Day 2

- [ ]  domain/service の基本UT追加
- [ ]  正常/異常を最低1ケースずつ書く

### Day 3

- [ ]  filter/sort/query 周りのUT追加

### Day 4

- [ ]  `item export --file ...` 実装
- [ ]  export仕様整理

### Day 5

- [ ]  table/json formatter 実装
- [ ]  `-format` 切替追加

### Day 6

- [ ]  config型と readonly の見直し
- [ ]  非破壊更新に寄せる

### Day 7

- [ ]  test 通し確認
- [ ]  export/format/configのREADME追記

---

## Sprint 8: 仕上げ

### Day 1

- [ ]  domain/input/persistence/output 型の棚卸し

### Day 2

- [ ]  重複型整理
- [ ]  命名見直し

### Day 3

- [ ]  CLI entrypoint と help/usage整理

### Day 4

- [ ]  README本体作成
- [ ]  セットアップ/コマンド例/データ形式を書く

### Day 5

- [ ]  seedデータ作成
- [ ]  代表コマンドを手動で全部試す

### Day 6

- [ ]  API化するとしたら差し替える箇所をメモ
- [ ]  構成の意図を言語化

### Day 7

- [ ]  最終リファクタ
- [ ]  不要コード削除
- [ ]  最終README更新