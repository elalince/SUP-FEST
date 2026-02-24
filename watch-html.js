import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import posthtml from "posthtml";
import include from "posthtml-include";

function buildHtml() {
  // Собираем index.html
  const htmlIndex = fs.readFileSync("src/index.html", "utf8");
  posthtml([include({ root: "./src/components" })])
    .process(htmlIndex)
    .then(result => {
      fs.writeFileSync("dist/index.html", result.html);
      console.log("✅ dist/index.html updated");
    })
    .catch(err => console.error(err));

  // Собираем search-page.html
  if (fs.existsSync("src/search-page.html")) {
    const htmlSearch = fs.readFileSync("src/search-page.html", "utf8");
    posthtml([include({ root: "./src/components" })])
      .process(htmlSearch)
      .then(result => {
        fs.writeFileSync("dist/search-page.html", result.html);
        console.log("✅ dist/search-page.html updated");
      })
      .catch(err => console.error(err));
  }
}

function copyJs(filePath) {
  const relative = path.relative("src", filePath);
  const dest = path.join("dist", relative);
  const dir = path.dirname(dest);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.copyFileSync(filePath, dest);
  console.log(`📦 ${dest} copied`);
}

console.log("👀 Watching HTML & JS files…");
chokidar.watch(["src/**/*.html", "src/**/*.js"], { ignoreInitial: true })
  .on("all", (ev, filePath) => {
    console.log(`🔁 (${ev}) ${filePath}`);
    
    if (filePath.endsWith(".js")) {
      copyJs(filePath);
    } else {
      buildHtml();
    }
  });