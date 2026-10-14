import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height) {
  // Simple PNG generator with cyan clock shape
  const rowLength = width * 4 + 1; // 1 filter byte per row
  const rawData = Buffer.alloc(rowLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.42;
  const rInner = width * 0.36;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check clock rim
      const isRim = dist <= r && dist >= rInner;
      // Check clock center dot
      const isCenter = dist <= width * 0.08;
      // Check clock hands
      const isHourHand = dx === 0 && dy <= 0 && dy >= -r * 0.6;
      const isMinuteHand = dy === 0 && dx >= 0 && dx <= r * 0.75;
      // Background square with rounded corners
      const isInsideCard = Math.abs(dx) <= cx * 0.9 && Math.abs(dy) <= cy * 0.9;

      if (isRim || isCenter || isHourHand || isMinuteHand) {
        // Neon cyan / electric blue #38bdf8
        rawData[pixelOffset] = 0x38;
        rawData[pixelOffset + 1] = 0xbd;
        rawData[pixelOffset + 2] = 0xf8;
        rawData[pixelOffset + 3] = 0xff;
      } else if (dist < r) {
        // Deep charcoal dial #0f172a
        rawData[pixelOffset] = 0x0f;
        rawData[pixelOffset + 1] = 0x17;
        rawData[pixelOffset + 2] = 0x2a;
        rawData[pixelOffset + 3] = 0xff;
      } else if (isInsideCard) {
        // Dark background #07090e
        rawData[pixelOffset] = 0x07;
        rawData[pixelOffset + 1] = 0x09;
        rawData[pixelOffset + 2] = 0x0e;
        rawData[pixelOffset + 3] = 0xff;
      } else {
        // Transparent
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
      }
    }
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // Compression method
  ihdrData.writeUInt8(0, 11); // Filter method
  ihdrData.writeUInt8(0, 12); // Interlace method
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeInt32BE(crc, 8 + len);
  return chunk;
}

// Simple CRC-32 table
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1) | 0;
}

const outDir = path.resolve('public/icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

[16, 48, 128].forEach((size) => {
  const png = createPNG(size, size);
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png`);
});
