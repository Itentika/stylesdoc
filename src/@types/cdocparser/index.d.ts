declare module "cdocparser" {
  export interface ParseResult {
    [contextType: string]: {
      description: string;
      commentRange: {
        start: number;
        end: number;
      };
      annotationName?: any;
    }[];
  }

  export interface Comment {
    lines: string[];
    type: "block" | "line" | "poster";
    commentRange: {
      start: number;
      end: number;
    };
    context: Context;
  }

  export interface Context {
    type: string;
    name?: string;
    value?: string;
  }

  export class CommentExtractor {
    constructor(
      parser: (
        ctxCode: string,
        lineNumberFor: (indices: string | number) => number
      ) => Context,
      options?: {
        blockComment?: boolean;
        lineComment?: boolean;
        lineCommentStyle?: string;
        blockCommentStyle?: string;
      }
    );

    extract: (code: string) => Comment[];
  }

  export interface Annotations<T> {
    [name: string]: {
      alias?: {
        [name: string]: string;
      };
      parse?: (annotationLine: string, info: T, id: number) => any;
      default?: (comment: T) => { [name: string]: any } | string | undefined;
      autofill?: (comment: T) => { [name: string]: any } | string | undefined;
      multiple?: boolean;
      overwritePoster?: boolean;
      isAutofilled: boolean;
    };
    _: {
      alias: {
        [name: string]: string;
      };
    };
  }

  export interface CommentParserConfig {
    [name: string]: any
  }

  export class CommentParser<T> {
    constructor(annotations: Annotations<T>, config?: CommentParserConfig);
    parse(comments: Comment[], id?: number): ParseResult;
  }
}