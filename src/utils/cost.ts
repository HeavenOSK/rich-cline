import { ModelInfo } from "../shared/api"

/**
 * APIの使用コストを計算する関数
 * 
 * 注: thinking_delta（Extended Thinking機能）のトークンは、
 * Anthropic APIによって既にoutput_tokensに含まれているため、
 * 別途計算する必要はありません。
 * 
 * @param modelInfo モデル情報（価格など）
 * @param inputTokens 入力トークン数
 * @param outputTokens 出力トークン数（thinking_deltaトークンを含む）
 * @param cacheCreationInputTokens キャッシュ作成トークン数（オプション）
 * @param cacheReadInputTokens キャッシュ読み取りトークン数（オプション）
 * @returns 合計コスト（USD）
 */
export function calculateApiCost(
	modelInfo: ModelInfo,
	inputTokens: number,
	outputTokens: number,
	cacheCreationInputTokens?: number,
	cacheReadInputTokens?: number,
): number {
	const modelCacheWritesPrice = modelInfo.cacheWritesPrice
	let cacheWritesCost = 0
	if (cacheCreationInputTokens && modelCacheWritesPrice) {
		cacheWritesCost = (modelCacheWritesPrice / 1_000_000) * cacheCreationInputTokens
	}
	const modelCacheReadsPrice = modelInfo.cacheReadsPrice
	let cacheReadsCost = 0
	if (cacheReadInputTokens && modelCacheReadsPrice) {
		cacheReadsCost = (modelCacheReadsPrice / 1_000_000) * cacheReadInputTokens
	}
	const baseInputCost = ((modelInfo.inputPrice || 0) / 1_000_000) * inputTokens
	const outputCost = ((modelInfo.outputPrice || 0) / 1_000_000) * outputTokens
	const totalCost = cacheWritesCost + cacheReadsCost + baseInputCost + outputCost
	return totalCost
}
