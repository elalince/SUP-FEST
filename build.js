import esbuild from 'esbuild';

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['src/js/main.js'],
      bundle: true,
      outfile: 'dist/js/main.js',
    });

    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();