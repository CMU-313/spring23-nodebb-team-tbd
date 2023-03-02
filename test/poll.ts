const serializer = require("../nodebb-plugin-poll-modified/public/js/poll/serializer.js")(require.main.require('./src/utils'));
const Config = require("../nodebb-plugin-poll-modified/lib/config.js");

describe("Creating poll and (de)serializing...", () => {
    it("deserialize should undo serialize", done => {
        const pollString: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]\n- op1\n- op2\n[/poll]`;
        const config = Config.defaults;
        const samePollString: string = serializer.deserialize(
            serializer.serialize(pollString, config),
            config
        );
        if (samePollString === pollString) done();
        else done(new Error("Polls are not the same:\n" + pollString + "\nvs\n" + samePollString));
    });

    it("serialize should undo deserialize", done => {
        const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff00ff' } };
        const config = Config.defaults;
        const samePollConfig = serializer.serialize(serializer.deserialize(pollConfig, config), config);

        // Check if the two are the same using JSON.stringify
        if (JSON.stringify(samePollConfig) === JSON.stringify(pollConfig)) done();
        else done(new Error("Polls are not the same:\n" + JSON.stringify(pollConfig) + "\nvs\n" + JSON.stringify(samePollConfig)));

    });

    describe("Serializer should accept color, horizontal, and other existing options...", () => {
        it("should have both horizontal field and color field filled", done => {
            const pollString: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]\n- op1\n- op2\n[/poll]`;
            const config = Config.defaults;
            const pollConfig: string = serializer.serialize(pollString, config);
            const answer = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff00ff' } };

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error("Polls are not the same:\n" + JSON.stringify(answer) + "\nvs\n" + JSON.stringify(pollConfig)));
        });

        it("should have only horizontal field added no color", done => {
            const pollString: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true"]\n- op1\n- op2\n[/poll]`;
            const config = Config.defaults;
            const pollConfig: string = serializer.serialize(pollString, config);
            // should fall back onto default color
            const answer = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff0000' } };

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error("Polls are not the same:\n" + JSON.stringify(answer) + "\nvs\n" + JSON.stringify(pollConfig)));
        });

        it("should have only color added no horizontal", done => {
            const pollString: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" color="#ff00ff"]\n- op1\n- op2\n[/poll]`;
            const config = Config.defaults;
            const pollConfig: string = serializer.serialize(pollString, config);
            // should fall back onto default horizontal
            const answer = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: false, color: '#ff00ff' } };

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error("Polls are not the same:\n" + JSON.stringify(answer) + "\nvs\n" + JSON.stringify(pollConfig)));
        });

        it("should have neither color or horizontal added", done => {
            const pollString: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false"]\n- op1\n- op2\n[/poll]`;
            const config = Config.defaults;
            const pollConfig: string = serializer.serialize(pollString, config);
            // should fall back onto default horizontal and color
            const answer = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: false, color: '#ff0000' } };

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error("Polls are not the same:\n" + JSON.stringify(answer) + "\nvs\n" + JSON.stringify(pollConfig)));
        });

        it("should return null if type is not correct", done => {
            const pollString: string = `[2\n[/poll]`;
            const config = Config.defaults;
            const pollConfig: string = serializer.serialize(pollString, config);
            const answer = null;

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error("Polls are not the same:\n" + JSON.stringify(answer) + "\nvs\n" + JSON.stringify(pollConfig)));
        });
    });

    describe("Deserializer should accept color, horizontal, and other existing options...", () => {
        it("should have both horizontal field and color field filled", done => {
            const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff00ff' } };
            const config = Config.defaults;
            const pollString: string = serializer.deserialize(pollConfig, config);
            const answer: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]\n- op1\n- op2\n[/poll]`;

            if (answer === pollString) done();
            else done(new Error("Polls are not the same:\n" + answer + "\nvs\n" + pollString));
        });

        it("should have only horizontal field added no color", done => {
            const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true } };
            const config = Config.defaults;
            const pollString: string = serializer.deserialize(pollConfig, config);
            const answer: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true"]\n- op1\n- op2\n[/poll]`;

            if (answer === pollString) done();
            else done(new Error("Polls are not the same:\n" + answer + "\nvs\n" + pollString));
        });

        it("should have only color added no horizontal", done => {
            const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, color: '#ff00ff' } };
            const config = Config.defaults;
            const pollString: string = serializer.deserialize(pollConfig, config);
            const answer: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" color="#ff00ff"]\n- op1\n- op2\n[/poll]`;

            if (answer === pollString) done();
            else done(new Error("Polls are not the same:\n" + answer + "\nvs\n" + pollString));
        });

        it("should have neither color or horizontal added", done => {
            const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0 } };
            const config = Config.defaults;
            const pollString: string = serializer.deserialize(pollConfig, config);
            const answer: string = `[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false"]\n- op1\n- op2\n[/poll]`;

            if (answer === pollString) done();
            else done(new Error("Polls are not the same:\n" + answer + "\nvs\n" + pollString));
        });

        it("should fail if type is not correct", done => {
            try {
                const pollConfig = {};
                const config = Config.defaults;
                serializer.deserialize(pollConfig, config);
                done(new Error("Should have failed"));
            } catch (e) {
                done();
            }
        });
    });
});