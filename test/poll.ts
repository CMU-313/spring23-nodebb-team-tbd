const assert = require("assert");
const s = require("../nodebb-plugin-poll-modified/");
const Config = require("../nodebb-plugin-poll-modified/lib/config");

describe("Creating poll and serializing...", () => {
  describe(".deserialize()", () => {
    // Both horizontal field and color field filled
    it("should fail if", done => {
      const pollTest = {};

      const configTest = {};

      const result: string = s.deserialize(pollTest, configTest);

      const expectedString: string = `[poll title="hfield" maxvotes="69" disallowVoteUpdate="false" horizontal="false" color="#ff00ff"]`;

      //   return "[poll" + settings + "]\n" + options + "\n[/poll]";
    });

    // Only horizontal field added no color
    it("should fail if", done => {
      const pollTest = {};

      const configTest = {};

      const result: string = s.deserialize(pollTest, configTest);

      const expectedString: string = "[poll ";

      //   return "[poll" + settings + "]\n" + options + "\n[/poll]";
    });
    // Only color added no horizontal
    it("should fail if", done => {
      const pollTest = {};

      const configTest = {};

      const result: string = s.deserialize(pollTest, configTest);

      const expectedString: string = "[poll horizontal";

      //   return "[poll" + settings + "]\n" + options + "\n[/poll]";
    });
    // Neither color or horizontal added
    it("should fail if", done => {
      const pollTest = {};

      const configTest = {};

      const result: string = s.deserialize(pollTest, configTest);

      const expectedString: string = "[poll horizontal";

      //   return "[poll" + settings + "]\n" + options + "\n[/poll]";
    });

    it("deserialize should undo serialize", done => {
      const pollString: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]\n- op1\n- op2\n[/poll]`;
      const config = Config.settings.get();
      const samePollString: string = s.deserialize(
        s.serialize(pollString, config),
        config
      );
      if (samePollString === pollString) done();
      else done(new Error("Polls are not the same"));
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
