import {
    Context as CdocParserContext,
    Comment as CdocParserComment,
} from "cdocparser";
import { AccessType } from "../../global/enums/acessType";

export type Context = CdocParserContext & {
    snippet?: string;
    line?: { start: number; end: number };
    value?: string;
    params?: {
        quoteData?: string;
        arguments?: string;
        isAssignment?: boolean;
        selector?: string;
        condition?: string;
    };
};

export type AliasDescription = {
    name: string,
    group?: string,
    type?: string
}

export type Link = {
    url?: string,
    caption?: string
}

export type TypeDescription = {
    type: string,
    description?: string
}

export type GroupDescription = {
    name: string,
    description?: string
}

export type Since = {
    version?: string,
    description?: string
}

export type Example = {
    type: string,
    code: string,
    description?: string
}

export type ElementDescription = {
    name?: string,
    type?: string,
    default?: string,
    description?: string
}

export type SeeElementType = {
    type: string,
    name: string
}

export type ElementReference = {
    context: Context
    description?: string,
    group?: string
}

export type RequireElement = {
    type: string,
    name: string,
    url?: string,
    group?: string,
    description?: string,
    external: boolean,
    autofilled?: boolean,
    context?: Context
}

export type Comment = CdocParserComment & {
    context: Context;
    description?: string;
    access?: AccessType;
    author?: string[];
    group?: GroupDescription;
    deprecated?: string;
    link?: Link[];
    since?: Since[];
    path: string;
    content?: string;
    name?: string;
    example?: Example[];
    parameter?: ElementDescription[];
    property?: ElementDescription[];
    output?: string;
    return?: TypeDescription;
    alias?: AliasDescription;
    aliased?: string[];
    aliasedGroup?: AliasDescription[];
    throw?: string[];
    todo?: string[];
    type?: string;
    namespace?: string;
    lang?: string;
    see?: SeeElementType[] | ElementReference[];
    require?: RequireElement[];
    usedBy?: ElementReference[];
};
