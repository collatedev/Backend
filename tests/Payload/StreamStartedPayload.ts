function streamStartedPayload() : any {
    return {
        data: [{
            id: 0,
            user_id: 0,
            user_name: "foo",
            game_id: 0,
            community_ids: [],
            type: "bar",
            title: "title",
            viewer_count: 0,
            started_at: new Date(),
            language: "en",
            thumbnail_url: "url"
        }]
    };
}

export default streamStartedPayload;