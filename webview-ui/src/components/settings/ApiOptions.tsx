import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useCallback } from "react"
import { ApiConfiguration } from "../../../../src/shared/api"
import { useExtensionState } from "../../context/ExtensionStateContext"

// Anthropic専用の実装
export const normalizeApiConfiguration = (apiConfiguration?: ApiConfiguration) => {
	// Anthropicモデルの情報
	const selectedModelInfo = {
		supportsImages: true, // Claude 3.7 Sonnetは画像をサポート
		supportsPromptCache: true, // Claude 3.7 Sonnetはプロンプトキャッシュをサポート
		contextWindow: 200000, // Claude 3.7 Sonnetのコンテキストウィンドウサイズ
	}

	return {
		selectedModelInfo,
	}
}

interface ApiOptionsProps {
	showModelOptions?: boolean
}

// Anthropic専用のAPIオプションコンポーネント
const ApiOptions = ({ showModelOptions = true }: ApiOptionsProps) => {
	const { apiConfiguration, setApiConfiguration } = useExtensionState()

	const handleApiKeyChange = useCallback(
		(e: any) => {
			console.log("ApiOptions handleApiKeyChange - Current apiConfiguration:", apiConfiguration)
			const newConfig = {
				...apiConfiguration,
				apiProvider: "anthropic" as const,
				apiKey: e.target.value,
			}
			console.log("ApiOptions handleApiKeyChange - New apiConfiguration:", newConfig)
			setApiConfiguration(newConfig)
		},
		[apiConfiguration, setApiConfiguration],
	)

	return (
		<div>
			<div style={{ marginBottom: "10px" }}>
				<div style={{ marginBottom: "5px" }}>
					<label htmlFor="anthropic-api-key">Anthropic API Key</label>
				</div>
				<VSCodeTextField
					id="anthropic-api-key"
					type="password"
					value={apiConfiguration?.apiKey || ""}
					onInput={handleApiKeyChange}
					placeholder="Enter your Anthropic API key"
					style={{ width: "100%" }}
				/>
				<div style={{ fontSize: "0.8em", marginTop: "5px", opacity: 0.8 }}>
					<a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">
						Get an API key from Anthropic
					</a>
				</div>
			</div>
		</div>
	)
}

export default ApiOptions
