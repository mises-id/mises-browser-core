export * from "./async-kv-store";
export * from "./utils";
export * from "./map/index";

export function* toGenerator<R = any>(p: Promise<R>) {
  return (yield p) as R;
}
