function YoutubeVideoPayload() : any {
	return {
		"feed": {
			"$": {
				"xmlns:yt": "http://www.youtube.com/xml/schemas/2015",
				"xmlns": "http://www.w3.org/2005/Atom"
			},
			"link": [
				{
					"$": {
						"rel": "hub",
						"href": "https://pubsubhubbub.appspot.com"
					}
				},
				{
					"$": {
						"rel": "self",
						"href": "https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCJU7oHhmt-EUa8KNfpuvDhA"
					}
				}
			],
			"title": [
				"YouTube video feed"
			],
			"updated": [
				"2019-07-30T08:07:48.581684321+00:00"
			],
			"entry": [
				{
					"id": [
						"yt:video:WbzYmskEgDE"
					],
					"yt:videoid": [
						"videoID"
					],
					"yt:channelid": [
						"channelID"
					],
					"title": [
						"title"
					],
					"link": [
						{
							"$": {
								"rel": "alternate",
								"href": "link"
							}
						}
					],
					"author": [
						{
							"name": [
								"Evan Coulson"
							],
							"uri": [
								"https://www.youtube.com/channel/UCJU7oHhmt-EUa8KNfpuvDhA"
							]
						}
					],
					"published": [
						"1970-01-01T00:00:00.001Z"
					],
					"updated": [
						"2019-07-30T08:07:48.581684321+00:00"
					]
				}
			]
		}
	};
}
    
export default YoutubeVideoPayload;