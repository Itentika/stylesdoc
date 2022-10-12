import { CommentExtractor } from "cdocparser"; 
import lessContextParser from "./contextParsers/less.context.parser";
import scssContextParser from "./contextParsers/scss.context.parser";

export const scssExtractor = new CommentExtractor(scssContextParser, {
  blockComment: false,
});
export const lessExtractor = new CommentExtractor(lessContextParser, {
  blockComment: false,
});
