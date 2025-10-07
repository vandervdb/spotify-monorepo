export {};

declare global {
  interface Global {
    base64FromArrayBuffer: (arrayBuffer: ArrayBuffer) => string;
  }

  let base64FromArrayBuffer: (arrayBuffer: ArrayBuffer) => string;
}
