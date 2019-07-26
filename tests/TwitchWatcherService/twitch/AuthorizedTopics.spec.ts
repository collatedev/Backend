import AuthorizedTopic from "../../../src/TwitchWatcherService/twitch/AuthorizedTopic";

describe('isAuthorizedTopic', () => {
    test('is an authorized topic', () => {
        const topic : AuthorizedTopic = new AuthorizedTopic("user");

        expect(topic.isAuthorized()).toBeTruthy();
    });

    test('is not an authorized topic', () => {
        const topic : AuthorizedTopic = new AuthorizedTopic("foo");

        expect(topic.isAuthorized()).toBeFalsy();
    });
});

describe('scope', () => {
    test('unauthorized topic has no scope', () => {
        const topic : AuthorizedTopic = new AuthorizedTopic("foo");

        expect(topic.scope()).toEqual([]);
    });

    test('authorized topic has a scope', () => {
        const topic : AuthorizedTopic = new AuthorizedTopic("user");

        expect(topic.scope()).toEqual(["user:read:email"]);
    });
});
