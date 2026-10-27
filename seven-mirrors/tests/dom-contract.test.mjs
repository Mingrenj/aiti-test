import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("页面 ID 唯一且脚本使用的 ID 都存在", async () => {
  const [html, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("app.js", root), "utf8"),
  ]);

  const htmlIds = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(htmlIds).size, htmlIds.length, "HTML 中不应出现重复 ID");

  const selectedIds = [...app.matchAll(/querySelector\("#([^"]+)"\)/g)].map((match) => match[1]);
  for (const id of selectedIds) {
    assert.ok(htmlIds.includes(id), `app.js 使用的 #${id} 必须存在于 HTML`);
  }
});

test("入口资源使用相对路径，适配 GitHub Pages 子目录", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/app\.js"/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/, "不应使用站点根路径资源");
});


