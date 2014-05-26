export declare var grunt: any;
export declare var options: IwcOptions;
export declare var target: string;
export declare var dest: string;
export declare function output(): string;
export declare function parts(): IwcParts;
export declare function combine(parts: IwcParts): string;
export interface IwcParts {
    script: string;
    styles: string;
    markup: string;
}
export interface IwcOptions {
    script: string;
    styles: string;
    markup: string;
    postfix: string;
}
