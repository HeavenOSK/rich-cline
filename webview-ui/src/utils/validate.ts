import { ApiConfiguration } from "../../../src/shared/api"

export function validateApiConfiguration(apiConfiguration?: ApiConfiguration): string | undefined {
	if (!apiConfiguration?.apiKey) {
		return "You must provide a valid API key."
	}
	return undefined
}

export function validateModelId(apiConfiguration?: ApiConfiguration): string | undefined {
	if (!apiConfiguration?.apiModelId) {
		return "You must select a model."
	}
	return undefined
}
