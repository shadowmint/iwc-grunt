export declare var grunt: any;
export declare var options: IwcOptions;
export declare var target: string;
export declare var dest: string;
export declare function set_template(path: string): void;
export declare function output(name?: string): string;
export declare function parts(): IwcParts;
export declare function combine(parts: IwcParts): string;
export interface IwcParts {
    script: string;
    styles: string;
    markup: string;
    resources: string;
    resource_map: {
        [key: string]: string;
    };
}
export interface IwcOptions {
    script: string;
    styles: string;
    markup: string;
    postfix: string;
    resources: string[];
}
