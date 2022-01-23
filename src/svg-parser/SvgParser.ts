export type SvgParsingContext = string;

export class SvgParser {
  input: string;
  index: number;
  contextStack: SvgParsingContext[] = [];

  constructor(input: string, context: SvgParsingContext) {
    this.input = input;
    this.index = 0;
    this.contextStack.push(context);
  }

  parse() {
    while (this.index < this.input.length) {
      const potentialMatchers =
        lexers[this.contextStack[this.contextStack.length - 1]];

      for (const lexer of potentialMatchers) {
        const match = lexer(this.input.slice(this.index));
        if (match) {
          this.index += match.matched.length;
        }
      }
    }
  }
}

type SvgLexer = (input: string) =>
  | {
      matched: string;
      matchedType: string;
      levelDiff?: number;
      popContext?: boolean;
      pushContext?: SvgParsingContext;
    }
  | undefined;

const lexers: { [key in SvgParsingContext]: SvgLexer[] } = {};
