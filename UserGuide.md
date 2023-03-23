# User Guide
The guide below details testing procedures for Team TBD's added features to the NodeBB codebase.

## Poll Plugin
- Polls feature is activated upon running `./nodebb setup` and `./nodebb build`
- Works only for instructor accounts, to prevent misuse and trolling of polls by students
- Click **New Topic** to generate a new post, and button with bar chart appears in toolbox
- Click button to add poll to post. Select poll options, and click **Confirm** to add poll to post.
- Poll options are rendered in post. 
###### User Tests
Features:
- **Add Option** button works to add new poll option
- **Remove Option** button works to remove latest poll option
- Poll color inputted as hex code changes all poll result bars
- User can only vote the number of times allowed by max votes input
- Poll ends at date given by calendar option; if date isn't given, poll is infinite
- User can select horizontal or vertical display options for poll
- Poll renders horizontally or vertically dpeending on which option is chosen
- Users can click **To Voting** in order to update their vote if box is checked to allow users to update their vote. Otherwise, **To Voting** button does not appear.
###### Automated Tests
The automated tests can be found in test/poll.ts. These tests make sure the serializer and deserializer for the poll option button are correctly
translating the user inputs to the rendered format. The tests verify that the serializer undos the deserializer and vice versa,
they ensure that the serializer accepts the fields available for user selection, and they make sure various combinations of the input fields
are rendered correctly. These tests are sufficient in covering the changes we have made because they demonstrate that our added options
are being translated through the serializer so they can be rendered. The rendered format is user tested because it is a visual component.

## LaTeX
- Any posts or replies can include LaTeX formulas, with classic LaTeX syntax like using double dollar signs ($$) to enter math mode, \sum for summation, etc.
- LaTeX syntax can be typed directly into the post text field in the left edit box of a new post, and the preview box on the right side will display rendered LaTeX
- Preview box and posts rerender upon state change (i.e. another character is typed) for real time LaTeX display
###### User Tests
Features:
- Preview box should update to display LaTeX code accurately
- Published posts should accurately display LaTeX formulas
###### Automated Tests
We were unable to test the LaTeX feature with automated tests because of the format in which the LaTeX code is generated and rendered.
It is sufficient to test this feature with user tests though, because it is a visual component.
