export default {
    CONTEXT_PARSER:
        /^\s*((@(?<at_name>[\w\-]+)((\s+((?<quote_data>(?:["'].+["']\s*,?\s*)+)|((?<selector>[\w#%(.].+)\s*(?:(?:{}?)|;|{))|(?<condition>.+)?))|(?<var>(?::\s*(?<var_value>.+))?;.*)|(?<empty_selector>:)))|((?:(?<fn_name>[\w.:@\-]+)\s*(?<fn_arguments>(?:\s+when\s+)?\(.*\)))))|(?<!---)(?<=--)(?<cssvar>\w[\w-]+):(?<cssvar_val>[^;]*)(.+(\s*?(?=\/{2}|\n|$)))?/, // eslint-disable-line no-useless-escape

    NAMESPACE: /^\s*(?<name>#\w*)[\s({]/,

    MIXIN: /^\s*(?<name>[\w#.-]*)\s*(?:\(\s*(?<args>[^)]*)\s*\))?.*?{/
};

