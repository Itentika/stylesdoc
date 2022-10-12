export function isVariable (value: string, isLess: boolean): boolean {
    const varSymbol = isLess ? "@" : "$";
    return value.startsWith(varSymbol);
 }