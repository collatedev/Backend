import ISecretGenerator from "../../src/TwitchWatcher/twitch/ISecretGenerator";

export default class MockSecretGenerator implements ISecretGenerator {
	private secret: string;

	constructor(secret: string) {
		this.secret = secret;
	}

	public generate(length: number) : string {
		return this.secret;
	}
}