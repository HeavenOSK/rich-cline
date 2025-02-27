# Rich-Cline プロジェクトルール

## プロジェクト概要
Rich-ClineはClineをフォークしたプロジェクトで、Anthropicに特化し、特にClaude 3.7 SonnetのExtended Thinking機能を最大限に活用することを目指しています。


 
## 作業終わりに
後々作業を振り返られるようにこまめに commit してほしい。
下記の順序で行う。
1. npm run check-types を実行
2. memory-bank へ作業内容を反映
3. git add . & git commit を行うこと。
 
## コーディングパターン

### 1. Anthropic専用化
- 他のプロバイダー関連のコードは削除または無効化する
- プロバイダー選択UIは表示しない
- Anthropic以外のプロバイダーに関連する設定は削除する

### 2. Extended Thinking対応
- Extended Thinkingはデフォルトで有効にする（ユーザー設定なし）
- thinking_deltaイベントを適切に処理する
- 思考プロセスを表示するUIコンポーネントを実装する

### 3. `<thinking>`タグ処理
- thinking_delta機能との統合方法を検討する
- システムプロンプトを適切に更新する

## ファイル構造パターン
- src/api/providers/: Anthropicハンドラーのみを保持
- src/api/transform/: ストリーミング処理関連のファイルを保持
- src/shared/api.ts: API関連の型定義と設定を保持

## 実装の優先順位
1. Anthropic専用化の完了（UI設定の簡素化）
2. Extended Thinking統合の完了（UIの更新、`<thinking>`タグ処理の修正）
3. ユーザーフィードバックに基づく改善

## 既知の課題
1. SDKの互換性: 新しいSDKバージョン（^0.37.0）との互換性の問題
2. `<thinking>`タグ処理: thinking_deltaとの統合方法の検討が必要
3. パフォーマンス: Extended Thinking機能使用時のパフォーマンスへの影響

## 学習した内容
1. Anthropic APIの最新機能（Extended Thinking, thinking_delta）の使用方法
2. プロンプトキャッシュ機能の実装方法の変更（ベータヘッダーの使用）
3. VSCode拡張機能のUI簡素化の方法
