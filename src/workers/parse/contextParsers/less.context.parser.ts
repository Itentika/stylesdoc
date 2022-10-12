import { Context } from "../interfaces";
import LESS_REGEX from "../helpers/less.regex";
import { ElementType } from "../../../global/enums/elementType";
import { addCodeToContext, extractCode, findCodeStart, isEmptyObject } from "../../../helpers/parsing.helper";

export default (
    ctxCode: string,
    lineNumberFor: (indices: string | number) => number
): Context => {
    const input = (ctxCode.trim().split(/[\n\r]+/g).find((x) => x !== "") ?? "").trim();

    let startIndex;
    let endIndex;
    const context = {
        type: ElementType.OTHER,
        params: {},
    } as Context;

    const match = LESS_REGEX.CONTEXT_PARSER.exec(input);

    if (match?.groups) {
        const wsOffset = Math.min((ctxCode.match(/\s*/) ?? []).length - 1, 0);
        startIndex = wsOffset + match.index;
        endIndex = startIndex + match[0].length;

        if (match.groups.var_value) {
            context.type = ElementType.VARIABLE;
            context.name = match.groups.at_name.trim();
            context.value = match.groups.var_value;
            context.params!.isAssignment = true;
        }
        else if (match.groups.at_name) {
            context.type = match.groups.var ? ElementType.VARIABLE : match.groups.at_name.toLowerCase();
            context.name = match.groups.at_name?.trim() ?? "Unnamed";

            context.params!.quoteData = match.groups.quote_data;
            context.params!.condition = match.groups.condition;
            context.params!.selector = match.groups.selector;
            if (isEmptyObject(context.params)) {
                context.params = undefined;
            }

            endIndex = addCodeToContext(context, ctxCode, match);

        } else if (match.groups.fn_name) {
            context.type = ElementType.MIXIN; // nu functions in LESS
            context.name = match.groups.fn_name.trim();
            context.params!.arguments = match.groups.fn_arguments;
            endIndex = addCodeToContext(context, ctxCode, match);

        } else if (match.groups.cssvar) {
            context.type = ElementType.CSSVAR;
            context.name = match.groups.cssvar;
            context.value = match.groups.cssvar_val;
        }
    } else {

        startIndex = findCodeStart(ctxCode, 0);
        endIndex = ctxCode.length - 1;

        if (startIndex > 0) {
            const innerCode = extractCode(ctxCode, startIndex);
            context.value = innerCode.trim();

            // check here if this is a namespace
            const namespace = LESS_REGEX.NAMESPACE.exec(input);
            if (namespace?.groups?.name) {
                context.name = namespace?.groups?.name;
                context.type = ElementType.NAMESPACE;
                context.value = "";
            }
            else {
                context.name = ctxCode.slice(0, startIndex).trim();
                context.type = ElementType.CSS;
            }

            endIndex = (innerCode.length + startIndex) + 1;
        }        
    }

    if (lineNumberFor !== undefined && startIndex !== undefined) {
        context.line = {
            start: lineNumberFor(startIndex) + 1,
            end: lineNumberFor(endIndex ?? 0) + 1,
        };
    }

    return context;
};
