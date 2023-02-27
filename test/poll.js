const assert = require("assert");
const s = require("../nodebb-plugin-poll-modified/");

describe("Creating poll and serializing...", () => {
    describe(".canSerialize()", () => {
        it("", (done) => {
            const pollTest = {};
            const configTest = {};
            const result = s.deserialize(pollTest, configTest);
        });
    });
});
/*
    Serializer.deserialize = function (poll, config) {
        console.log("Deserializing function");
        console.trace();
        var options = deserializeOptions(poll.options, config);
        var settings = deserializeSettings(poll.settings, config);

        return "[poll" + settings + "]\n" + options + "\n[/poll]";
    };
 */
// Serializer.canSerialize
/**
[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]
- op1
- op2
[/poll]
 */
/*
    Serializer.serialize = function (post, config) {
        console.log("Serializing function");
        pollRegex.lastIndex = 0;
        var match = pollRegex.exec(post);

        if (match === null) {
            return null;
        }

        return {
            options: serializeOptions(match.groups.content, config),
            settings: serializeSettings(match.groups.settings, config),
        };
    };
*/
