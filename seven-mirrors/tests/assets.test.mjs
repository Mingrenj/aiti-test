import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { DIMENSION_ORDER_V2 } from "../assessment.js";

const root = new URL("../assets/envoys/", import.meta.url);

test("14 个维度均有透明原图归档与优化 WebP", async () => {
  for (const key of DIMENSION_ORDER_V2) {
    const [original, webp, originalStat, webpStat] = await Promise.all([
      readFile(new URL(`originals/${key}.png`, root)),
      readFile(new URL(`${key}.webp`, root)),
      stat(new URL(`originals/${key}.png`, root)),
      stat(new URL(`${key}.webp`, root)),
    ]);
    assert.equal(original.subarray(1, 4).toString("ascii"), "PNG", `${key} 原图需为 PNG`);
    assert.equal(webp.subarray(0, 4).toString("ascii"), "RIFF", `${key} 需为 RIFF WebP`);
    assert.equal(webp.subarray(8, 12).toString("ascii"), "WEBP", `${key} 需为 WebP`);
    assert.ok(originalStat.size > webpStat.size, `${key} 的网站版本应小于原图`);
    assert.ok(webpStat.size < 450_000, `${key}.webp 应控制在 450 KB 内`);
  }
});
