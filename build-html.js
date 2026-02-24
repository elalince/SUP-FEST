import fs from "fs";
import posthtml from "posthtml";
import include from "posthtml-include";

async function buildHtml() {
  try {
    // Собираем index.html
    const htmlIndex = fs.readFileSync("src/index.html", "utf8");
    const resultIndex = await posthtml([include({ root: "./src/components" })])
      .process(htmlIndex);
    fs.writeFileSync("dist/index.html", resultIndex.html);
    console.log("✅ dist/index.html built");

    // Собираем search-page.html
    if (fs.existsSync("src/search-page.html")) {
      const htmlSearch = fs.readFileSync("src/search-page.html", "utf8");
      const resultSearch = await posthtml([include({ root: "./src/components" })])
        .process(htmlSearch);
      fs.writeFileSync("dist/search-page.html", resultSearch.html);
      console.log("✅ dist/search-page.html built");
    }
  } catch (error) {
    console.error("HTML build failed:", error);
    process.exit(1);
  }
}

buildHtml();
 