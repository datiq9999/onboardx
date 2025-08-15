// Polyfills cho môi trường trình duyệt
import { Buffer } from "buffer";
import process from "process";

// gắn vào global để các SDK truy cập được
// (dùng globalThis an toàn hơn cho mọi runtime)
(globalThis as any).global = globalThis;
(globalThis as any).process = process;
(globalThis as any).Buffer = Buffer;
