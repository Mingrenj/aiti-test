import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";
import { DIMENSION_ORDER_V2 } from "../assessment.js";

const root = new URL("../assets/envoys/", import.meta.url);

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

test("14 个维度均有透明原图归档与优化 WebP", async () => {
  const expected = [...DIMENSION_ORDER_V2].sort();
  const [originalNames, webpNames] = await Promise.all([
    readdir(new URL("originals/", root)),
    readdir(root),
  ]);
  assert.deepEqual(originalNames.filter((name) => name.endsWith(".png")).map((name) => name.slice(0, -4)).sort(), expected);
  assert.deepEqual(webpNames.filter((name) => name.endsWith(".webp")).map((name) => name.slice(0, -5)).sort(), expected);

  for (const key of DIMENSION_ORDER_V2) {
    const [original, webp, originalStat, webpStat] = await Promise.all([
      readFile(new URL(`originals/${key}.png`, root)),
      readFile(new URL(`${key}.webp`, root)),
      stat(new URL(`originals/${key}.png`, root)),
      stat(new URL(`${key}.webp`, root)),
    ]);
    assert.equal(original.subarray(1, 4).toString("ascii"), "PNG", `${key} 原图需为 PNG`);
    assert.equal(original.subarray(12, 16).toString("ascii"), "IHDR", `${key} PNG 需包含 IHDR`);
    assert.equal(original.readUInt32BE(16), 1122, `${key} 原图宽度应为 1122`);
    assert.equal(original.readUInt32BE(20), 1402, `${key} 原图高度应为 1402`);
    assert.equal(original[25], 6, `${key} PNG 必须是带 alpha 的 RGBA`);
    assert.equal(webp.subarray(0, 4).toString("ascii"), "RIFF", `${key} 需为 RIFF WebP`);
    assert.equal(webp.subarray(8, 12).toString("ascii"), "WEBP", `${key} 需为 WebP`);
    assert.equal(webp.subarray(12, 16).toString("ascii"), "VP8X", `${key} WebP 需使用 VP8X 容器`);
    assert.ok(webp[20] & 0x10, `${key} WebP 必须保留 alpha`);
    assert.equal(readUInt24LE(webp, 24) + 1, 768, `${key} WebP 宽度应为 768`);
    assert.equal(readUInt24LE(webp, 27) + 1, 960, `${key} WebP 高度应为 960`);
    assert.ok(originalStat.size > webpStat.size, `${key} 的网站版本应小于原图`);
    assert.ok(webpStat.size < 450_000, `${key}.webp 应控制在 450 KB 内`);
  }
});
