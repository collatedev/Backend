function twitchFollowPayload() : any {
    return {
        data: [{
            from_id: 0,
            from_name: "foo",
            to_id: 1,
            to_name: "bar",
            followed_at: new Date(),
        }]
    };
}

export default twitchFollowPayload;