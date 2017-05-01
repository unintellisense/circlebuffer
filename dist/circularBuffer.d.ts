export declare class CircularBuffer<T> {
    private length;
    private start;
    private end;
    private size;
    private data;
    overflow: null | ((T, CBuffer) => void);
    constructor(size: number, data?: T[]);
    pop(): T;
    push(args: T & {
        length?: number;
    } | T[] | undefined): number;
    reverse(): this;
    rotateLeft(cntr: any): this;
    rotateRight(cntr: any): this;
    shift(): T;
    sort(fn: any): this;
    unshift(args: T & {
        length?: number;
    } | T[] | undefined): number;
    indexOf(arg: T, idx?: number): number;
    lastIndexOf(arg: T, idx?: number): number;
    sortedIndex(value: T, comparator: Function, context: any): number;
    every(callback: Function, context: any): boolean;
    forEach(callback: Function, context: any): void;
    some(callback: Function, context: any): boolean;
    avg(): number;
    sum(): number;
    median(): number;
    empty(): this;
    fill(arg: T): this;
    first(): T;
    last(): T;
    get(arg: number): T;
    isFull(): boolean;
    set(idx: number, arg: T): T;
    toArray(): T[];
    slice(start?: number, end?: number): T[];
}
