/**
 * 与ReturnType不同:
 * type T0 = ReturnType<() => Promise<string>> // T0: Promise<string>
 * type T1 = AsyncReturnType<() => Promise<string>> // T1: string
 * */
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export { AsyncReturnType };
