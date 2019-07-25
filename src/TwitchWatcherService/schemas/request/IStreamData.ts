export default interface IStreamData {
	id: number;
	user_id: number;
	user_name: string;
	game_id: number;
	community_ids: number[];
	type: string;
	title: string;
	viewer_count: number;
	started_at: string;
	language: string;
	thumbnail_url: string;
}