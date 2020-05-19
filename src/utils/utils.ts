export default function addNewLine(text: string, line: string): string {
  if (text === null) {
    return line;
  }
  return `${text}\n${line}`;
}
