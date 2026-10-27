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
  assert.match(html, /href="\.\/styles\.css(?:\?[^"#]+)?"/);
  assert.match(html, /src="\.\/app\.js(?:\?[^"#]+)?"/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/, "不应使用站点根路径资源");
});

test("雷达绘制成功后隐藏兜底提示层", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("app.js", root), "utf8"),
  ]);

  assert.match(html, /id="radar-fallback"\s+hidden/);
  assert.match(app, /\$\("radar-fallback"\)\.hidden\s*=\s*true/);
  assert.match(styles, /\.radar-fallback\[hidden\]\s*\{[^}]*display\s*:\s*none\s*!important/i);
});

test("完整十四维结果仅使用文字，人物图只保留在双使者首屏", async () => {
  const [html, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("app.js", root), "utf8"),
  ]);

  const template = html.match(/<template id="dimension-card-template">([\s\S]*?)<\/template>/)?.[1] ?? "";
  assert.ok(template, "应存在十四维文字结果模板");
  assert.doesNotMatch(template, /<img\b|dimension-art|dimension-sigil/);

  const renderer = app.match(/function renderFamilyDimensions\([\s\S]*?\r?\n}\r?\n\r?\nfunction renderActions/)?.[0] ?? "";
  assert.ok(renderer, "应存在十四维结果渲染函数");
  assert.doesNotMatch(renderer, /ENVOY_PATH|\.webp|dimension-art|dimension-sigil/);
  assert.match(html, /id="vice-envoy-image"/);
  assert.match(html, /id="virtue-envoy-image"/);
  assert.match(app, /function envoyAssetUrl\(key\)/);
  assert.match(app, /\.webp\?v=\$\{ENVOY_ASSET_VERSION\}/);
});

