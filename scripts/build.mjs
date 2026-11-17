// GitHub Pages retains the legacy subpath-safe demo; the normal-domain build uses the new design.
if(process.argv.includes('--demo'))await import('./build-legacy.mjs');else await import('./build-modern.mjs');
