'use strict';

const Config = require('nodebb-plugin-poll-modified/lib/config');
const serializer = require('nodebb-plugin-poll-modified/public/js/poll/serializer');

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const Serializer = serializer(require.main.require('./src/utils'));

describe('Creating poll and (de)serializing...', () => {
  it('deserialize should undo serialize', (done) => {
    const pollString = '[poll title="Test-title" maxvotes="69" disallowVoteUpdate="false" horizontal="true" color="#ff00ff"]\n- op1\n- op2\n[/poll]';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const config = Config.defaults;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const samePollString = Serializer.deserialize(Serializer.serialize(pollString, config), config);
    if (samePollString === pollString) done();
    else done(new Error(`Polls are not the same:\n${pollString}\nvs\n${samePollString}`));
  });

  it('serialize should undo deserialize', (done) => {
    const pollConfig = { options: ['op1', 'op2'], settings: { title: 'Test-title', maxvotes: 69, disallowVoteUpdate: false, end: 0, horizontal: true, color: '#ff00ff' } };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const config = Config.defaults;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const samePollConfig = Serializer.serialize(Serializer.deserialize(pollConfig, config), config);

    // Check if the two are the same using JSON.stringify
    if (JSON.stringify(samePollConfig) === JSON.stringify(pollConfig)) done();
    else done(new Error(`Polls are not the same:\n${JSON.stringify(pollConfig)}\nvs\n${JSON.stringify(samePollConfig)}`));
  });
});
