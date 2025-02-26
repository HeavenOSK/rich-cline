import { Anthropic } from "@anthropic-ai/sdk"
import { ApiConfiguration, DEFAULT_API_HANDLER_OPTIONS, ModelInfo } from "../shared/api"
import { AnthropicHandler } from "./providers/anthropic"
import { ApiStream } from "./transform/stream"

export interface ApiHandler {
	createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream
	getModel(): { id: string; info: ModelInfo }
}

export interface SingleCompletionHandler {
	completePrompt(prompt: string): Promise<string>
}

export function buildApiHandler(configuration: ApiConfiguration): ApiHandler {
	// デフォルト値をマージ
	const options = {
		...DEFAULT_API_HANDLER_OPTIONS,
		...configuration,
	}
	return new AnthropicHandler(options)
}
