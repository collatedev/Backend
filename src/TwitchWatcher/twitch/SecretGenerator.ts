import ISecretGenerator from "./ISecretGenerator";

const DefaultAlphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()";

export default class SecretGenerator implements ISecretGenerator {
	private alphabet: string;

	constructor(alphabet? : string) {
		if (alphabet === undefined) {
			this.alphabet = DefaultAlphabet;
		} else {
			this.alphabet = alphabet;
		}
	}

	public generate(length: number) : string {
		let secret : string = "";
		for (let i : number = 0; i < length; i++) {
			secret += this.alphabet.charAt(
				// TODO: Replace with secure random generator
				Math.floor(Math.random() * this.alphabet.length)
			);
		}
		return secret;
	}
}