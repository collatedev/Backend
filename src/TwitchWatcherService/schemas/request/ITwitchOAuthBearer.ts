export default interface ITwitchOAuthBearer {
	accessToken: string;
	refreshToken: string;
	scope: string[];
	error: string;
	status: number;
	message: string;
}