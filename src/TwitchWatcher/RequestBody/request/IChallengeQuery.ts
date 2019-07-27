export default interface IChallengeQuery {
    'hub.topic': string;
    'hub.lease_seconds': number;
    'hub.mode': string;
    'hub.challenge': string;
}