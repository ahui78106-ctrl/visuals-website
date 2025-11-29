const fs = require("fs-extra");
const path = require("path");
const { marked } = require("marked");

const SRC = path.join(__dirname, "src");
const DIST = path.join(__dirname, "dist");
const POSTS = path.join(SRC, "content", "posts");

async function copyStatic() {
  await fs.remove(DIST);
  await fs.copy(SRC, DIST, {
    filter: src =>
      !src.includes("content/posts") && !src.endsWith(".md")
  });
}

async function buildPosts() {
  const template = await fs.readFile(
    path.join(SRC, "post-template.html"),
    "utf8"
  );

  const files = await fs.readdir(POSTS);
  const postsMeta = [];

  for (const f of files) {
    if (!f.endsWith(".md")) continue;

    const md = await fs.readFile(path.join(POSTS, f), "utf8");

    const lines = md.split("\n");
    let title = "Untitled Post";
    let date = "";
    let i = 0;

    while (i < lines.length) {
      const L = lines[i];
      if (L.startsWith("Title:")) title = L.replace("Title:", "").trim();
      if (L.startsWith("Date:")) date = L.replace("Date:", "").trim();
      if (L.trim() === "---") {
        i++;
        break;
      }
      i++;
    }

    const bodyMd = lines.slice(i).join("\n");
    const html = marked.parse(bodyMd);
    const slug = f.replace(/\.md$/, "");

    const outputHtml = template
      .replace(/{{title}}/g, title)
      .replace(/{{date}}/g, date)
      .replace("{{content}}", html);

    await fs.outputFile(
      path.join(DIST, "blog", `${slug}.html`),
      outputHtml,
      "utf8"
    );

    postsMeta.push({ title, date, slug });
  }

  const blogTemplate = await fs.readFile(
    path.join(SRC, "blog", "index.html"),
    "utf8"
  );

  const listHtml = postsMeta
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      p =>
        `<li><a href="./${p.slug}.html">${p.title}</a><span class="muted"> ${p.date}</span></li>`
    )
    .join("\n");

  const blogOut = blogTemplate.replace("{{posts}}", listHtml);

  await fs.outputFile(path.join(DIST, "blog", "index.html"), blogOut, "utf8");
}

(async () => {
  try {
    await copyStatic();
    await buildPosts();
    console.log("Build complete. Output -> dist/");
  } catch (err) {
    console.error(err);
  }
})();
