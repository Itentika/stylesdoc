export default {
    CONTEXT_PARSER: 
        /^\s*(@(?<at_rule>[\w-]+)\s+((?:(?<at_name>[\w-]+)\s*(?:\((?<at_arguments>.*)\))*)|(?<at_quote_data>(?:["'].+["']\s*,?\s*)+)(?:as\s(?<as_nmsp>[^;]+))?|((?<at_selector>[\w#%(.].+)\s*(?:(?:{}?)|;)?\n)|(?<at_condition>.+)?))|(?:%(?<template>[\w-]+))|(?<!---)(?<=--)(?<cssvar>\w[\w-]+):(?<cssvar_val>[^;]*)|\$(?<variable>(?<variable_name>[\w-]+)(?<variable_assignment>:)?\s*(?<variable_value>[^;]*)).*(\s*?(?=\/{2}|\n|$))?/,

    FILE_AS_NAMESPACE: /(.*?\/)*(?<file>[\s\w-]*)(.\w*)?/
};

