# Rich-Cline 技術コンテキスト

## 使用技術

Rich-Clineは以下の主要な技術を使用しています：

### コア技術

- **TypeScript**: プロジェクトの主要言語
- **Node.js**: サーバーサイドJavaScript実行環境
- **VSCode API**: VSCode拡張機能開発のためのAPI
- **React**: WebViewベースのUIコンポーネント

### 主要な依存関係

- **@anthropic-ai/sdk**: Anthropic APIとの通信のためのSDK
  - 現在のバージョン: 0.26.0
  - 目標バージョン: ^0.37.0以上（thinking_delta機能をサポート）
- **esbuild**: TypeScriptのビルドツール
- **axios**: HTTP通信ライブラリ
- **puppeteer-core**: ブラウザ自動化ライブラリ

## Anthropic API

### Claude 3.7 Sonnet

Claude 3.7 Sonnetは、Anthropicの最新モデルで、以下の特徴を持っています：

- **コンテキストウィンドウ**: 200,000トークン
- **最大出力トークン**: 8,192トークン（標準）、128,000トークン（ベータ）
- **Extended Thinking**: 複雑なタスクでのパフォーマンス向上のための機能
- **thinking_delta**: モデルの思考プロセスをリアルタイムでストリーミングする機能

### Extended Thinking API

Extended Thinkingを有効にするには、APIリクエストに以下のパラメータを追加します：

```typescript
client.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 1024,
  extended_thinking: true,  // Extended Thinkingを有効化
  messages: [
    { "role": "user", "content": "複雑な問題..." }
  ]
})
```

ストリーミング時には、`thinking_delta`イベントを処理するためのハンドラーが必要です：

```typescript
with client.messages.stream({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 1024,
  extended_thinking: true,
  messages: [...]
}) as stream:
  for event in stream:
    if event.type == "thinking_delta":
      // 思考プロセスを処理
      console.log(event.delta.thinking)
```

Extended Thinkingの可視性は`extended_thinking_visibility`パラメータで制御できます：

- `"streaming_only"` (デフォルト): 思考プロセスはストリーミングイベントでのみ表示
- `"visible"`: 思考プロセスは最終レスポンスにも含まれる
- `"hidden"`: 思考プロセスはストリーミングでも最終レスポンスでも表示されない

## 開発環境

### 必要条件

- **Node.js**: v18.x以上
- **npm**: v9.x以上
- **VSCode**: v1.84.0以上

### 開発環境のセットアップ

1. リポジトリのクローン
   ```bash
   git clone https://github.com/HeavenOSK/rich-cline.git
   cd rich-cline
   ```

2. 依存関係のインストール
   ```bash
   npm run install:all
   ```

3. 開発サーバーの起動
   ```bash
   npm run watch
   ```

4. VSCodeでデバッグ実行
   - F5キーを押してデバッグモードで拡張機能を起動

## 技術的な制約

### 1. Anthropic APIの制約

- **レート制限**: APIキーごとに一定のリクエスト制限あり
- **トークン制限**: 最大コンテキストウィンドウは200,000トークン
- **Extended Thinking**: 標準モードよりもトークン使用量が増加

### 2. VSCode拡張の制約

- **サンドボックス**: VSCode拡張はサンドボックス環境で実行される
- **パフォーマンス**: WebViewベースのUIはネイティブUIよりもパフォーマンスが低い
- **ストレージ**: 永続化ストレージの容量に制限あり

### 3. ブラウザ機能の制約

- **セキュリティ**: ブラウザ自動化には特定のセキュリティ制限あり
- **リソース**: ブラウザの起動と操作には一定のリソースが必要

## アーキテクチャの詳細

### 1. APIレイヤー

APIレイヤーは、Anthropic APIとの通信を担当します。主要なコンポーネントは以下の通りです：

- **AnthropicHandler**: Anthropic APIとの通信を処理するクラス
- **StreamProcessor**: ストリーミングレスポンスを処理するクラス
- **ApiStream**: ストリーミングデータの型定義

### 2. UIレイヤー

UIレイヤーは、WebViewベースのユーザーインターフェースを提供します：

- **WebViewProvider**: WebViewを管理するクラス
- **ChatView**: チャットインターフェースを提供するReactコンポーネント
- **ThinkingRenderer**: 思考プロセスを表示するコンポーネント

### 3. 設定レイヤー

設定レイヤーは、ユーザー設定を管理します：

- **SettingsProvider**: 設定を管理するクラス
- **ExtendedThinkingSettings**: Extended Thinking関連の設定

## 依存関係の詳細

### 主要な依存関係

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.37.0",
    "axios": "^1.7.4",
    "react": "^18.2.0",
    "puppeteer-core": "^23.4.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "esbuild": "^0.25.0"
  }
}
```

### 開発ツール

- **ESLint**: コード品質とスタイルの検証
- **Prettier**: コードフォーマッター
- **Husky**: Gitフックの管理
- **Changesets**: バージョン管理と変更ログの生成

## デプロイメント

### VSCode拡張のパッケージング

```bash
npm run package
```

### VSCode Marketplaceへの公開

```bash
npm run publish:marketplace
```

## 将来の技術的な展望

1. **SDKの更新**: Anthropic SDKの最新バージョンへの定期的な更新
2. **パフォーマンスの最適化**: UIレンダリングとストリーミング処理の最適化
3. **新機能の統合**: Anthropicの新機能が利用可能になった場合の迅速な統合
