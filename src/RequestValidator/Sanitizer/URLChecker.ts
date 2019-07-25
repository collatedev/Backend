import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";

const urlRegexPattern : string = 
'^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]' +
'\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\' +
'd|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00' +
'a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localho' +
'st)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';

const urlRegex : RegExp = new RegExp(urlRegexPattern, 'i');

export default class URLChecker {
    public static isURL(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.isURL !== undefined && !urlRegex.test(value);
    }
}