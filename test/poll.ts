import serializer from 'nodebb-plugin-poll-modified/public/js/poll/serializer';
import Config from 'nodebb-plugin-poll-modified/lib/config';

require.main.require('./src/utils');

describe('Creating poll and (de)serializing...', () => {
    it('deserialize should undo serialize', (done) => {
        const pollString = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]\n- op1\n- op2\n[/poll]';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const config = Config.defaults;
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const samePollString: string = serializer.deserialize(
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            serializer.serialize(pollString, config),
            config
        );
        if (samePollString === pollString) done();
        else done(new Error(`Polls are not the same:\n${pollString}\nvs\n${samePollString}`));
    });

    it('serialize should undo deserialize', (done) => {
        const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff00ff' } };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const config = Config.defaults;
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        const samePollConfig = serializer.serialize(serializer.deserialize(pollConfig, config), config);

        // Check if the two are the same using JSON.stringify
        if (JSON.stringify(samePollConfig) === JSON.stringify(pollConfig)) done();
        else done(new Error(`Polls are not the same:\n${JSON.stringify(pollConfig)}\nvs\n${JSON.stringify(samePollConfig)}`));
    });

    describe('Serializer should accept color, horizontal, and other existing options...', () => {
        it('should have both horizontal field and color field filled', (done) => {
            const pollString = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]\n- op1\n- op2\n[/poll]';
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollConfig: string = serializer.serialize(pollString, config);
            const answer = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff00ff' } };

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error(`Polls are not the same:\n${JSON.stringify(answer)}\nvs\n${JSON.stringify(pollConfig)}`));
        });

        it('should have only horizontal field added no color', (done) => {
            const pollString = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true"]\n- op1\n- op2\n[/poll]';
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollConfig: string = serializer.serialize(pollString, config);
            // should fall back onto default color
            const answer = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff0000' } };

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error(`Polls are not the same:\n${JSON.stringify(answer)}\nvs\n${JSON.stringify(pollConfig)}`));
        });

        it('should have only color added no horizontal', (done) => {
            const pollString = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" color="#ff00ff"]\n- op1\n- op2\n[/poll]';
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollConfig: string = serializer.serialize(pollString, config);
            // should fall back onto default horizontal
            const answer = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: false, color: '#ff00ff' } };

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error(`Polls are not the same:\n${JSON.stringify(answer)}\nvs\n${JSON.stringify(pollConfig)}`));
        });

        it('should have neither color or horizontal added', (done) => {
            const pollString = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false"]\n- op1\n- op2\n[/poll]';
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollConfig: string = serializer.serialize(pollString, config);
            // should fall back onto default horizontal and color
            const answer = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: false, color: '#ff0000' } };

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error(`Polls are not the same:\n${JSON.stringify(answer)}\nvs\n${JSON.stringify(pollConfig)}`));
        });

        it('should return null if type is not correct', (done) => {
            const pollString = '[2\n[/poll]';
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollConfig: string = serializer.serialize(pollString, config);
            const answer = null;

            // Check if the two are the same using JSON.stringify
            if (JSON.stringify(answer) === JSON.stringify(pollConfig)) done();
            else done(new Error(`Polls are not the same:\n${JSON.stringify(answer)}\nvs\n${JSON.stringify(pollConfig)}`));
        });
    });

    describe('Deserializer should accept color, horizontal, and other existing options...', () => {
        it('should have both horizontal field and color field filled', (done) => {
            const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff00ff' } };
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollString: string = serializer.deserialize(pollConfig, config);
            const answer = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]\n- op1\n- op2\n[/poll]';

            if (answer === pollString) done();
            else done(new Error(`Polls are not the same:\n${answer}\nvs\n${pollString}`));
        });

        it('should have only horizontal field added no color', (done) => {
            const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true } };
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollString: string = serializer.deserialize(pollConfig, config);
            const answer = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true"]\n- op1\n- op2\n[/poll]';

            if (answer === pollString) done();
            else done(new Error(`Polls are not the same:\n${answer}\nvs\n${pollString}`));
        });

        it('should have only color added no horizontal', (done) => {
            const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, color: '#ff00ff' } };
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollString: string = serializer.deserialize(pollConfig, config);
            const answer = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" color="#ff00ff"]\n- op1\n- op2\n[/poll]';

            if (answer === pollString) done();
            else done(new Error(`Polls are not the same:\n${answer}\nvs\n${pollString}`));
        });

        it('should have neither color or horizontal added', (done) => {
            const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0 } };
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const config = Config.defaults;
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const pollString: string = serializer.deserialize(pollConfig, config);
            const answer = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false"]\n- op1\n- op2\n[/poll]';

            if (answer === pollString) done();
            else done(new Error(`Polls are not the same:\n${answer}\nvs\n${pollString}`));
        });

        it('should fail if type is not correct', (done) => {
            try {
                const pollConfig = {};
                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                const config = Config.defaults;
                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                serializer.deserialize(pollConfig, config);
                done(new Error('Should have failed'));
            } catch (e) {
                done();
            }
        });
    });
});
