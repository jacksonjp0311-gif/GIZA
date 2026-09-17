const releaseVersion = import.meta.env.VITE_GIZA_RELEASE_VERSION || '0.10.12';
const devBuild = import.meta.env.VITE_GIZA_DEV_BUILD;

export const GIZA_DISPLAY_VERSION = devBuild
  ? `${releaseVersion}+dev.${devBuild}`
  : releaseVersion;
