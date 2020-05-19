import addNewLine from '../../../src/utils/utils';

describe('Add line', () => {
  it('Should return line if text is null', () => {
    const text: string = null;
    const line: string = 'testLine';

    const result: string = addNewLine(text, line);

    expect(result).toBe(line);
  });
  it('Should add the new line to the text', () => {
    const text: string = 'testText';
    const line: string = 'testLine';
    const expectResult: string = 'testText\ntestLine';

    const result: string = addNewLine(text, line);

    expect(result).toBe(expectResult);
  });
});
