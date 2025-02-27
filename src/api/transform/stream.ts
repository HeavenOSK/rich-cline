export type ApiStream = AsyncGenerator<ApiStreamChunk>
export type ApiStreamChunk = ApiStreamTextChunk | ApiStreamUsageChunk | ApiStreamThinkingChunk | ApiStreamSignatureChunk

export interface ApiStreamTextChunk {
	type: "text"
	text: string
}

export interface ApiStreamThinkingChunk {
	type: "thinking"
	thinking: string
}

export interface ApiStreamSignatureChunk {
	type: "signature"
	signature: string
}

export interface ApiStreamUsageChunk {
	type: "usage"
	inputTokens: number
	outputTokens: number
	cacheWriteTokens?: number
	cacheReadTokens?: number
	totalCost?: number // openrouter
}
