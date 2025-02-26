import {
	VSCodeButton,
	VSCodeCheckbox,
	VSCodeDropdown,
	VSCodeLink,
	VSCodeOption,
	VSCodeTextArea,
	VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react"
import { memo, useEffect, useState } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration, validateModelId } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import SettingsButton from "../common/SettingsButton"
import { anthropicDefaultModelId, anthropicModels } from "../../../../src/shared/api"
const { IS_DEV } = process.env

type SettingsViewProps = {
	onDone: () => void
}

const SettingsView = ({ onDone }: SettingsViewProps) => {
	const {
		apiConfiguration,
		setApiConfiguration,
		version,
		customInstructions,
		setCustomInstructions,
		telemetrySetting,
		setTelemetrySetting,
	} = useExtensionState()
	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)
	const [modelIdErrorMessage, setModelIdErrorMessage] = useState<string | undefined>(undefined)

	const handleSubmit = () => {
		const apiValidationResult = validateApiConfiguration(apiConfiguration)
		const modelIdValidationResult = validateModelId(apiConfiguration)

		setApiErrorMessage(apiValidationResult)
		setModelIdErrorMessage(modelIdValidationResult)

		if (!apiValidationResult && !modelIdValidationResult) {
			vscode.postMessage({ type: "apiConfiguration", apiConfiguration })
			vscode.postMessage({
				type: "customInstructions",
				text: customInstructions,
			})
			vscode.postMessage({
				type: "telemetrySetting",
				text: telemetrySetting,
			})
			onDone()
		}
	}

	useEffect(() => {
		setApiErrorMessage(undefined)
		setModelIdErrorMessage(undefined)
	}, [apiConfiguration])

	// validate as soon as the component is mounted
	/*
	useEffect will use stale values of variables if they are not included in the dependency array. so trying to use useEffect with a dependency array of only one value for example will use any other variables' old values. In most cases you don't want this, and should opt to use react-use hooks.
	
	useEffect(() => {
		// uses someVar and anotherVar
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [someVar])

	If we only want to run code once on mount we can use react-use's useEffectOnce or useMount
	*/

	const handleResetState = () => {
		vscode.postMessage({ type: "resetState" })
	}

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				padding: "10px 0px 0px 20px",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "17px",
					paddingRight: 17,
				}}>
				<h3 style={{ color: "var(--vscode-foreground)", margin: 0 }}>Settings</h3>
				<VSCodeButton onClick={handleSubmit}>Done</VSCodeButton>
			</div>
			<div
				style={{
					flexGrow: 1,
					overflowY: "scroll",
					paddingRight: 8,
					display: "flex",
					flexDirection: "column",
				}}>
				<div style={{ marginBottom: 5 }}>
					{/* Anthropic設定を直接実装 */}
					<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
						<div>
							<label htmlFor="api-provider">
								<span style={{ fontWeight: 500 }}>API Provider</span>
							</label>
							<div style={{ marginTop: 5 }}>Anthropic</div>
						</div>

						<div>
							<VSCodeTextField
								value={apiConfiguration?.apiKey || ""}
								style={{ width: "100%" }}
								type="password"
								onInput={(e: any) =>
									setApiConfiguration({
										...apiConfiguration,
										apiKey: e.target.value,
									})
								}
								placeholder="Enter API Key...">
								<span style={{ fontWeight: 500 }}>Anthropic API Key</span>
							</VSCodeTextField>

							<VSCodeCheckbox
								checked={!!apiConfiguration?.anthropicBaseUrl}
								onChange={(e: any) => {
									const isChecked = e.target.checked === true
									if (!isChecked) {
										setApiConfiguration({
											...apiConfiguration,
											anthropicBaseUrl: "",
										})
									}
								}}>
								Use custom base URL
							</VSCodeCheckbox>

							{!!apiConfiguration?.anthropicBaseUrl && (
								<VSCodeTextField
									value={apiConfiguration?.anthropicBaseUrl || ""}
									style={{ width: "100%", marginTop: 3 }}
									type="url"
									onInput={(e: any) =>
										setApiConfiguration({
											...apiConfiguration,
											anthropicBaseUrl: e.target.value,
										})
									}
									placeholder="Default: https://api.anthropic.com"
								/>
							)}

							<p
								style={{
									fontSize: "12px",
									marginTop: 3,
									color: "var(--vscode-descriptionForeground)",
								}}>
								This key is stored locally and only used to make API requests from this extension.
								{!apiConfiguration?.apiKey && (
									<VSCodeLink
										href="https://console.anthropic.com/settings/keys"
										style={{
											display: "inline",
											fontSize: "inherit",
										}}>
										You can get an Anthropic API key by signing up here.
									</VSCodeLink>
								)}
							</p>
						</div>

						{/* モデル選択ドロップダウン */}
						<div>
							<label htmlFor="model-id">
								<span style={{ fontWeight: 500 }}>Model</span>
							</label>
							<VSCodeDropdown
								id="model-id"
								value={apiConfiguration?.apiModelId || anthropicDefaultModelId}
								onChange={(e: any) =>
									setApiConfiguration({
										...apiConfiguration,
										apiModelId: e.target.value,
									})
								}
								style={{ width: "100%" }}>
								<VSCodeOption value="">Select a model...</VSCodeOption>
								{Object.keys(anthropicModels).map((modelId) => (
									<VSCodeOption
										key={modelId}
										value={modelId}
										style={{
											whiteSpace: "normal",
											wordWrap: "break-word",
											maxWidth: "100%",
										}}>
										{modelId}
									</VSCodeOption>
								))}
							</VSCodeDropdown>
						</div>

						{apiErrorMessage && (
							<p
								style={{
									margin: "-10px 0 4px 0",
									fontSize: 12,
									color: "var(--vscode-errorForeground)",
								}}>
								{apiErrorMessage}
							</p>
						)}

						{modelIdErrorMessage && (
							<p
								style={{
									margin: "-10px 0 4px 0",
									fontSize: 12,
									color: "var(--vscode-errorForeground)",
								}}>
								{modelIdErrorMessage}
							</p>
						)}
					</div>
				</div>

				<div style={{ marginBottom: 5 }}>
					<VSCodeTextArea
						value={customInstructions ?? ""}
						style={{ width: "100%" }}
						resize="vertical"
						rows={4}
						placeholder={'e.g. "Run unit tests at the end", "Use TypeScript with async/await", "Speak in Spanish"'}
						onInput={(e: any) => setCustomInstructions(e.target?.value ?? "")}>
						<span style={{ fontWeight: "500" }}>Custom Instructions</span>
					</VSCodeTextArea>
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						These instructions are added to the end of the system prompt sent with every request.
					</p>
				</div>

				<div style={{ marginBottom: 5 }}>
					<VSCodeCheckbox
						style={{ marginBottom: "5px" }}
						checked={telemetrySetting === "enabled"}
						onChange={(e: any) => {
							const checked = e.target.checked === true
							setTelemetrySetting(checked ? "enabled" : "disabled")
						}}>
						Allow anonymous error and usage reporting
					</VSCodeCheckbox>
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						Help improve Cline by sending anonymous usage data and error reports. No code, prompts, or personal
						information is ever sent. See our{" "}
						<VSCodeLink
							href="https://github.com/cline/cline/blob/main/docs/PRIVACY.md"
							style={{ fontSize: "inherit" }}>
							privacy policy
						</VSCodeLink>{" "}
						for more details.
					</p>
				</div>

				{IS_DEV && (
					<>
						<div style={{ marginTop: "10px", marginBottom: "4px" }}>Debug</div>
						<VSCodeButton onClick={handleResetState} style={{ marginTop: "5px", width: "auto" }}>
							Reset State
						</VSCodeButton>
						<p
							style={{
								fontSize: "12px",
								marginTop: "5px",
								color: "var(--vscode-descriptionForeground)",
							}}>
							This will reset all global state and secret storage in the extension.
						</p>
					</>
				)}

				<div
					style={{
						marginTop: "auto",
						paddingRight: 8,
						display: "flex",
						justifyContent: "center",
					}}>
					<SettingsButton
						onClick={() => vscode.postMessage({ type: "openExtensionSettings" })}
						style={{
							margin: "0 0 16px 0",
						}}>
						<i className="codicon codicon-settings-gear" />
						Advanced Settings
					</SettingsButton>
				</div>
				<div
					style={{
						textAlign: "center",
						color: "var(--vscode-descriptionForeground)",
						fontSize: "12px",
						lineHeight: "1.2",
						padding: "0 8px 15px 0",
					}}>
					<p
						style={{
							wordWrap: "break-word",
							margin: 0,
							padding: 0,
						}}>
						If you have any questions or feedback, feel free to open an issue at{" "}
						<VSCodeLink href="https://github.com/cline/cline" style={{ display: "inline" }}>
							https://github.com/cline/cline
						</VSCodeLink>
					</p>
					<p
						style={{
							fontStyle: "italic",
							margin: "10px 0 0 0",
							padding: 0,
						}}>
						v{version}
					</p>
				</div>
			</div>
		</div>
	)
}

export default memo(SettingsView)
