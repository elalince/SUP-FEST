import esbuild from 'esbuild';
import rawPlugin from 'esbuild-plugin-raw';

async function watchMain() {
  try {
    const ctx = await esbuild.context({
      entryPoints: ['src/js/main.js'],
      bundle: true,
      outfile: 'dist/js/main.js',
      plugins: [rawPlugin()],
    });

    await ctx.watch();
    console.log('Watching main.js...');
  } catch (error) {
    console.error('Watch failed:', error);
    process.exit(1);
  }
}

async function watchLang() {
  const ctx = await esbuild.context({
    entryPoints: ['src/js/lang.js'],
    bundle: true,
    outfile: 'dist/js/lang.js',
    plugins: [rawPlugin()],
  });

  await ctx.watch();
  console.log('Watching lang.js...');
}

const target = process.argv[2];
if (target === 'main') {
  watchMain();
} else if (target === 'lang') {
  watchLang();
}