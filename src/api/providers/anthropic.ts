import { Anthropic } from "@anthropic-ai/sdk"
import { Stream as AnthropicStream } from "@anthropic-ai/sdk/streaming"
import { withRetry } from "../retry"
import { anthropicDefaultModelId, AnthropicModelId, anthropicModels, ApiHandlerOptions, ModelInfo } from "../../shared/api"
import { ApiHandler } from "../index"
import { ApiStream } from "../transform/stream"

export class AnthropicHandler implements ApiHandler {
	private options: ApiHandlerOptions
	private client: Anthropic

	constructor(options: ApiHandlerOptions) {
		this.options = options
		this.client = new Anthropic({
			apiKey: this.options.apiKey,
			baseURL: this.options.anthropicBaseUrl || undefined,
		})
	}

	@withRetry()
	async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
		const model = this.getModel()
		let stream: AnthropicStream<any>
		const modelId = model.id

		// プロンプトキャッシュをサポートするモデルかどうかを確認
		const supportsCaching = [
			"claude-3-7-sonnet-20250219",
			"claude-3-5-sonnet-20241022",
			"claude-3-5-haiku-20241022",
			"claude-3-opus-20240229",
			"claude-3-haiku-20240307",
		].includes(modelId)

		if (supportsCaching) {
			/*
			The latest message will be the new user message, one before will be the assistant message from a previous request, and the user message before that will be a previously cached user message. So we need to mark the latest user message as ephemeral to cache it for the next request, and mark the second to last user message as ephemeral to let the server know the last message to retrieve from the cache for the current request.
			*/
			const userMsgIndices = messages.reduce(
				(acc, msg, index) => (msg.role === "user" ? [...acc, index] : acc),
				[] as number[],
			)
			const lastUserMsgIndex = userMsgIndices[userMsgIndices.length - 1] ?? -1
			const secondLastMsgUserIndex = userMsgIndices[userMsgIndices.length - 2] ?? -1

			// キャッシュコントロールを適用したメッセージを作成
			const processedMessages = messages.map((message, index) => {
				if (index === lastUserMsgIndex || index === secondLastMsgUserIndex) {
					return {
						...message,
						content:
							typeof message.content === "string"
								? [
										{
											type: "text",
											text: message.content,
											cache_control: {
												type: "ephemeral",
											},
										},
									]
								: message.content.map((content, contentIndex) =>
										contentIndex === message.content.length - 1
											? {
													...content,
													cache_control: {
														type: "ephemeral",
													},
												}
											: content,
									),
					}
				}
				return message
			})

			// システムプロンプトにキャッシュコントロールを適用
			const systemWithCache = {
				text: systemPrompt,
				type: "text" as const,
				cache_control: { type: "ephemeral" as const },
			}

			// ベータヘッダーを使用してメッセージを作成
			stream = await this.client.beta.messages.create(
				{
					model: modelId,
					max_tokens: model.info.maxTokens || 8192,
					temperature: 1,
					system: [systemWithCache],
					messages: processedMessages as any, // 型の互換性のために一時的にanyを使用
					stream: true,
					// Extended Thinkingを常に有効化
					thinking: {
						type: "enabled" as const,
						budget_tokens: 4096, // デフォルト値
					},
				},
				{
					headers: {
						"anthropic-beta": "prompt-caching-2024-07-31",
					},
				},
			)
		} else {
			// 通常のメッセージ作成
			stream = await this.client.beta.messages.create({
				model: modelId,
				max_tokens: model.info.maxTokens || 8192,
				temperature: 1,
				system: systemPrompt,
				messages,
				stream: true,
				// Extended Thinkingを常に有効化
				thinking: {
					type: "enabled" as const,
					budget_tokens: 4096, // デフォルト値
				},
			})
		}

		for await (const chunk of stream) {
			switch (chunk.type) {
				case "message_start":
					// tells us cache reads/writes/input/output
					const usage = chunk.message.usage
					yield {
						type: "usage",
						inputTokens: usage.input_tokens || 0,
						outputTokens: usage.output_tokens || 0,
						cacheWriteTokens: usage.cache_creation_input_tokens || undefined,
						cacheReadTokens: usage.cache_read_input_tokens || undefined,
					}
					break
				case "message_delta":
					// tells us stop_reason, stop_sequence, and output tokens along the way and at the end of the message
					yield {
						type: "usage",
						inputTokens: 0,
						outputTokens: chunk.usage.output_tokens || 0,
					}
					break
				case "message_stop":
					// no usage data, just an indicator that the message is done
					break
				case "content_block_start":
					switch (chunk.content_block.type) {
						case "text":
							// we may receive multiple text blocks, in which case just insert a line break between them
							if (chunk.index > 0) {
								yield {
									type: "text",
									text: "\n",
								}
							}
							yield {
								type: "text",
								text: chunk.content_block.text,
							}
							break
						case "thinking":
							// Extended Thinking機能で生成された思考プロセス
							yield {
								type: "thinking",
								thinking: chunk.content_block.thinking,
							}
							break
					}
					break
				case "content_block_delta":
					switch (chunk.delta.type) {
						case "text_delta":
							yield {
								type: "text",
								text: chunk.delta.text,
							}
							break
						case "thinking_delta":
							// Extended Thinking機能で生成された思考プロセスの増分
							yield {
								type: "thinking",
								thinking: chunk.delta.thinking,
							}
							break
						case "signature_delta":
							yield {
								type: "signature",
								signature: chunk.delta.signature,
							}
							break
					}
					break
				case "content_block_stop":
					break
			}
		}
	}

	getModel(): { id: AnthropicModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId
		if (modelId && modelId in anthropicModels) {
			const id = modelId as AnthropicModelId
			return { id, info: anthropicModels[id] }
		}
		return {
			id: anthropicDefaultModelId,
			info: anthropicModels[anthropicDefaultModelId],
		}
	}
}
