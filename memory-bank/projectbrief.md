# Rich-Cline プロジェクト概要

## プロジェクト名
Rich-Cline

## 概要
Rich-ClineはClineをフォークしたプロジェクトで、元のClineが様々なLLMプロバイダー（Anthropic、OpenAI、Google Gemini、AWS Bedrock、Azure、GCP Vertexなど）に対応しているのに対して、このプロジェクトではAnthropicに限定して最適化を施すことを目指しています。特に、最近リリースされたClaude 3.7 SonnetのExtended Thinking機能を最大限に活用することが主な目的です。

## 目標
1. **Anthropic専用化**: 他のプロバイダーの選択を不可能にし、Anthropicのみに特化することでコードベースを簡素化
2. **Extended Thinking対応**: Claude 3.7 SonnetのExtended Thinking機能を最大限に活用
3. **SDKアップデート**: @anthropic-ai/sdkを^0.37.0以上にアップデートし、thinking_delta機能をサポート
4. **システム修正**: thinking_deltaによって`<thinking>`タグの出力が不要になるため、システム側を修正

## 元のClineとの違い
- **プロバイダー**: 元のClineは複数のLLMプロバイダーに対応しているが、Rich-Clineは**Anthropicのみ**に対応
- **最適化**: Anthropicの最新機能（特にExtended Thinking）に特化した最適化
- **シンプル化**: 他のプロバイダーのコードを削除することで、コードベースをシンプル化
- **ユーザーエクスペリエンス**: Extended Thinking機能を活用した、より高度な推論能力を提供

## プロジェクトの性質
このプロジェクトは実験的な性質を持ち、まずは開発者自身が使用して評価することを目的としています。Anthropicの最新機能を最大限に活用することで、AIアシスタントの能力をさらに引き出すことを目指しています。

## 主要な変更点
1. Anthropic以外のプロバイダーの選択を不可能にする
2. @anthropic-ai/sdkを^0.37.0に更新
3. thinking_delta機能を活用するためのシステム修正
4. `<thinking>`タグの出力が不要になるための関連コード修正

## タイムライン
- フェーズ1: Anthropic以外のプロバイダーの削除
- フェーズ2: SDKのアップデートと基本的な統合
- フェーズ3: Extended Thinking機能の完全な統合
- フェーズ4: UIの最適化とユーザーエクスペリエンスの向上
