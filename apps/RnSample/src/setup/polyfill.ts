import { Buffer } from 'buffer';
import process from 'process';

if (typeof globalThis.Buffer === 'undefined') {
    (globalThis as any).Buffer = Buffer;
}
if (typeof globalThis.process === 'undefined') {
    (globalThis as any).process = process;
}

if (typeof (globalThis as any).atob === 'undefined') {
    (globalThis as any).atob = (data: string): string =>
        Buffer.from(data, 'base64').toString('binary');
}
if (typeof (globalThis as any).btoa === 'undefined') {
    (globalThis as any).btoa = (data: string): string =>
        Buffer.from(data, 'binary').toString('base64');
}

(globalThis as any).base64FromArrayBuffer = function (arrayBuffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) binary += String.fromCharCode(uint8Array[i]);
    return (globalThis as any).btoa(binary);
};
