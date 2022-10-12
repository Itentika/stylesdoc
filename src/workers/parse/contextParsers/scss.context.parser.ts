import { Context } from "../interfaces";
import SCSS_REGEX from "../helpers/scss.regex";
import { ElementType } from "../../../global/enums/elementType";
import { addCodeToContext, extractCode, findCodeStart, isEmptyObject, getSupportedName, trimQuotes } from "../../../helpers/parsing.helper";

export default (
    ctxCode: string,
    lineNumberFor: (indices: string | number) => number
): Context => {
    const match = SCSS_REGEX.CONTEXT_PARSER.exec(ctxCode.trim());
    
    let startIndex;
    let endIndex;
    const context = {
        type: ElementType.OTHER,
        params: {},
    } as Context;

    if (match?.groups) {
        const wsOffset = Math.min((ctxCode.match(/\s*/) ?? []).length - 1, 0);
        startIndex = wsOffset + match.index;
        endIndex = startIndex + match[0].length;

        if (match.groups.at_rule) {
            context.type = getSupportedName(match.groups.at_rule);
            context.name = match.groups.at_name?.trim() ?? "Unnamed";

            context.params!.arguments = match.groups.at_arguments; // comma-separated list, eg. '$color, $amount: 100%'
            context.params!.quoteData = trimQuotes(match.groups.at_quote_data);
            context.params!.condition = match.groups.at_condition;
            context.params!.selector = match.groups.at_selector;
            if (isEmptyObject(context.params)) {
                context.params = undefined;
            }

            if (context.type === ElementType.USE || context.type === ElementType.FORWARD) {
                if (match.groups.as_nmsp) {
                    context.name = match.groups.as_nmsp;
                }
                else {
                    const fileAsNamespaceMatch = SCSS_REGEX.FILE_AS_NAMESPACE.exec(context.params?.quoteData ?? "");
                    context.name = fileAsNamespaceMatch?.groups?.file ?? context.name;
                }
            }

            endIndex = addCodeToContext(context, ctxCode, match);

        } else if (match.groups.template) {
            // template in first line of code
            context.type = ElementType.PLACEHOLDER;
            context.name = match.groups.template.trim();
            endIndex = addCodeToContext(context, ctxCode, match);

        } else if (match.groups.variable) {
            context.type = ElementType.VARIABLE;
            context.name = match.groups.variable_name;
            context.value = match.groups.variable_value;
            context.params!.isAssignment = Boolean(match.groups.variable_assignment);

        } else if (match.groups.cssvar) {
            context.type = ElementType.CSSVAR;
            context.name = match.groups.cssvar;
            context.value = match.groups.cssvar_val;

        }
    } else {
        startIndex = findCodeStart(ctxCode, 0);
        endIndex = ctxCode.length - 1;

        if (startIndex > 0) {
            context.type = ElementType.CSS;
            context.name = ctxCode.slice(0, startIndex).trim();
            context.value = extractCode(ctxCode, startIndex).trim();
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
