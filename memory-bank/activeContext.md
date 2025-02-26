# Rich-Cline アクティブコンテキスト

## 現在の作業の焦点

Rich-Clineプロジェクトは現在、以下の作業に焦点を当てています：

1. **Anthropic専用化**: 他のプロバイダーの選択を不可能にし、Anthropicのみに特化
2. **Extended Thinking対応**: Claude 3.7 SonnetのExtended Thinking機能を活用するための準備
3. **UI設定の簡素化**: プロバイダー選択UIの削除

## 最近の変更

以下の作業が完了しています：

1. **package.jsonの更新**: @anthropic-ai/sdkを^0.26.0から^0.37.0に更新
2. **依存関係のインストール**: npm installの実行
3. **型定義の更新**:
   - ApiHandlerOptionsにExtended Thinking関連の設定を追加
   - ApiStreamにThinkingChunk型を追加
   - AnthropicHandlerの修正（thinking_deltaイベントの処理を追加）
4. **Anthropic専用化**:
   - src/api/index.tsの修正: プロバイダー選択ロジックの削除
   - 不要なプロバイダーファイルの削除: src/api/providers/ディレクトリの整理
   - src/shared/api.tsの修正: Anthropic以外のプロバイダー関連の定義を削除
   - 変換関連の不要なファイルの削除: gemini-format.ts、mistral-format.ts、o1-format.tsを削除
5. **UI設定の簡素化**:
   - webview-ui/src/components/settings/ApiOptions.tsxの削除
   - webview-ui/src/components/settings/OpenRouterModelPicker.tsxの削除
   - webview-ui/src/components/settings/__tests__/APIOptions.spec.tsxの削除
   - webview-ui/src/components/settings/SettingsView.tsxの修正: Anthropic専用UIの直接実装
   - webview-ui/src/utils/validate.tsの修正: Anthropicのみのバリデーションに簡素化

## 次のステップ

以下のタスクが次のステップとして計画されています：

### フェーズ1: Anthropic専用化の完了

✅ **UI設定の簡素化**:
   - ✅ プロバイダー選択UIの削除
   - ✅ 設定画面からAnthropic以外のプロバイダー関連の設定を削除

### フェーズ2: thinking_delta統合

✅ **Extended Thinkingのデフォルト有効化**:
   - ✅ `src/shared/api.ts`にデフォルト設定を追加
   - ✅ `src/api/index.ts`でデフォルト値をマージするよう修正
   - ✅ `src/api/providers/anthropic.ts`でExtended Thinkingを常に有効化

✅ **`<thinking>`タグ処理の修正**:
   - ✅ `src/core/prompts/system.ts`の`<thinking>`タグ関連の指示を「深く考慮する」という表現に置き換え

1. **UIの更新**:
   - 思考プロセス表示用のコンポーネントの追加

## アクティブな決定と考慮事項

### 1. Anthropic専用化のアプローチ

**決定**: 他のプロバイダーのコードを削除し、Anthropicのみをサポート

**考慮事項**:
- コードベースの簡素化
- Anthropicの特殊機能への最適化
- UIの簡素化

### 2. Extended Thinking設定

**決定**:
- Extended Thinkingをデフォルトで有効にする
- ユーザーUI設定は提供せず、内部的に常に有効化

**考慮事項**:
- ユーザーエクスペリエンスの向上
- 複雑なタスクでのパフォーマンス向上

### 3. `<thinking>`タグ処理の方針

**決定**:
- `<thinking>`タグの指示を「深く考慮する」という表現に置き換え
- Extended Thinkingを常に有効化してthinking_delta機能を活用

**考慮事項**:
- 後方互換性
- コードの複雑さ
- ユーザーエクスペリエンスの一貫性

## 現在の課題

1. ✅ **UI設定の簡素化**: プロバイダー選択UIの削除
   - 影響: ユーザーインターフェース、設定画面
   - 対応: WebViewのコンポーネント修正（完了）

2. **プロンプトキャッシュの実装変更**: プロンプトキャッシュ機能がベータヘッダーとして提供されるようになった
   - 影響: `this.client.beta.promptCaching.messages.create`から`headers: {"anthropic-beta": "prompt-caching-2024-07-31"}`の形式に変更
   - 対応: AnthropicHandlerの修正（完了）

3. **初期設定画面の問題**: APIキーを入力して「Let's go!」ボタンを押しても次に進まない問題
   - 影響: ユーザーオンボーディング体験
   - 対応: WelcomeView.tsxのhandleSubmit関数を修正し、apiConfigurationにデフォルトのモデルID（claude-3-7-sonnet-20250219）を追加（完了）

3. **Extended Thinking統合**: ✅ thinking_delta機能の統合完了
   - 影響: UIレンダリング、ストリーミング処理
   - 対応: 
     - ✅ Extended Thinkingをデフォルトで有効化
     - ✅ `<thinking>`タグの指示を「深く考慮する」という表現に置き換え
     - 思考プロセス表示用のUIコンポーネントの追加（未着手）

4. **型チェックエラー**: ✅ Anthropic SDK ^0.37.0 との互換性の問題
   - 影響: ビルドプロセス、コード品質
   - 対応:
     - ✅ `TextBlock` 型に `citations` プロパティが必須になった問題の修正
     - ✅ `Usage` 型に `cache_creation_input_tokens` と `cache_read_input_tokens` プロパティが必須になった問題の修正
     - ✅ VSCode Language Model API 関連の型エラーの修正
     - ✅ 残存している他のプロバイダー関連コードの削除
     - ✅ `src/integrations/misc/export-markdown.ts`の修正: 型アサーションを追加
     - ✅ `src/core/webview/ClineProvider.ts`の修正: 不要なプロバイダー関連のコードを削除、`extendedThinkingVisibility`プロパティの型を修正

## 今後の展望

1. **Extended Thinking機能の完全な統合**: UIの最適化とユーザーエクスペリエンスの向上
2. **ユーザーフィードバックの収集**: 実際の使用感と改善点の把握
