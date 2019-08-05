const DeleteVideoPayload : any = {  
	"feed": {  
	   "$":{  
			"xmlns:at":"http://purl.org/atompub/tombstones/1.0",
			"xmlns":"http://www.w3.org/2005/Atom"
		},
		"at:deleted-entry":[  
			{  
				"$":{  
					"ref":"yt:video:videoID",
					"when":"2019-07-31T07:19:30+00:00"
				},
				"link":[  
					{  
						"$":{  
							"href":"https://www.youtube.com/watch?v=BYgis73x8CM"
						}
					}
				],
				"at:by":[  
					{  
						"name":[  
							"Evan Coulson"
						],
						"uri":[  
							"https://www.youtube.com/channel/channelID"
						]
					}
				]
			}
	   ]
	}
};

export default DeleteVideoPayload;