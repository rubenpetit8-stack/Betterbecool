/* Minimal PNG height-cropper.
 *
 * Headless Chromium paints only its viewport, which is shorter than the window
 * it was asked for, so a fixed-size image comes out clipped along the bottom.
 * We work around it by rendering with vertical headroom and trimming the extra
 * rows back off here.
 *
 * Trimming from the bottom is the easy direction: PNG row filters only ever
 * reference the row above, so keeping a prefix of rows needs no re-filtering.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

/** Trim `file` to its top `keepRows` pixel rows, in place. No-op if already that tall. */
export function cropPngHeight(file, keepRows) {
  const buf = readFileSync(file);
  if (!buf.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG: " + file);

  let ihdr = null;
  const idat = [];
  for (let off = 8; off + 8 <= buf.length; ) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("latin1", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") ihdr = Buffer.from(data);
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    off += 12 + len;
  }
  if (!ihdr || !idat.length) throw new Error("malformed PNG: " + file);

  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  const interlace = ihdr[12];

  if (keepRows >= height) return { width, height, cropped: false };
  if (bitDepth !== 8 || interlace !== 0 || !CHANNELS[colorType]) {
    throw new Error(`unsupported PNG format (depth ${bitDepth}, colour ${colorType}, interlace ${interlace})`);
  }

  const stride = 1 + width * CHANNELS[colorType];
  const raw = inflateSync(Buffer.concat(idat));
  const kept = raw.subarray(0, stride * keepRows);

  ihdr.writeUInt32BE(keepRows, 4);
  writeFileSync(file, Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(kept, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]));

  return { width, height: keepRows, cropped: true };
}

export function pngSize(file) {
  const b = readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
