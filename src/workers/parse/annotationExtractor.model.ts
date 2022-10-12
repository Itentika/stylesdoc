import { Comment } from "./interfaces";
import Annotation from "./annotations/base";
import Config from "../../streams/parse/config";
import { buildAnnotations } from "./annotation.provider";
import { Annotations, CommentParser, CommentParserConfig } from "cdocparser";


export class AnnotationExtractor {
    private readonly annotations: Annotations<Comment>;
    private readonly parser: CommentParser<Comment>;

    constructor(config: Config) {

        const annotations = Object.fromEntries(
            buildAnnotations(config).map(instance => ([instance.name, instance]))
        ) as { [name: string]: Annotation };

        this.annotations = Object.assign(
            annotations,
            {
                _: {
                    alias: Object.assign(
                        {},
                        ...Object.keys(annotations).map((key) =>
                            Object.assign(
                                {
                                    [key]: key,
                                },
                                annotations[key].alias
                            ) as { [name: string]: string }
                        )
                    ) as { [name: string]: string },
                },
            }
        );

        const parserConfig = this.buildParserConfig(config);
        this.parser = new CommentParser(this.annotations, parserConfig);
    }

    extract(comments: Comment[]): any {
        // strip annotations not allowed in poster
        const poster = comments.find(x => x.type === "poster");
        this.sanitizePosterAnnotations(poster);

        const parsed = this.parser.parse(comments) as any;

        // Remove newlines and meaningless whitespaces
        for (const x of parsed) {
            x.description = this.removeNewLines(x.description);
        }

        return parsed;
    }
    
    public get autofilled(): string[] {
        return Object.entries(this.annotations)
            .filter(([name, annotation]) => name !== "_" && annotation.isAutofilled)
            .map(([name]) => name);
    }
    
    private removeNewLines(source: string): string {
        return (source ?? "").trim().replace(/\r\n|\r|\n/g, "");
    }

    private sanitizePosterAnnotations(poster: Comment | undefined) {
        if (poster === undefined) {
            return;
        }

        const forbiddenAnnotations = Object.keys(this.annotations)
            .filter(name => name !== "_" && !(<Annotation>this.annotations[name]).allowedInPoster)
            .flatMap(name => [name, ...(<Annotation>this.annotations[name]).aliases])
            .map(x => `@${x}`);

        const isAllowed = (line: string): boolean => !forbiddenAnnotations.some(x => line.trimStart().startsWith(x));

        poster.lines = poster.lines.filter(line => isAllowed(line));
    }

    private buildParserConfig(config: Config): CommentParserConfig {
        // convert list of annotation with autofill disabled (in "config.disableAutofil") to 
        // list of annotations with autofill enabled (by taking all and excludinge disabled)
        // Under the hood, cdocparser treats "autofill" as string[] | boolean
        if (config.autofill && config.disableAutofill.length > 0) {
            return {
                autofill: this.autofilled.filter(x => !config.disableAutofill.includes(x))
            }
        }

        return { autofill: config.autofill };
    }
}

export default (config: Config): AnnotationExtractor => {
    return new AnnotationExtractor(config);
};
