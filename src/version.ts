const releaseVersion = import.meta.env.VITE_GIZA_RELEASE_VERSION || '0.11.0';
const devBuild = import.meta.env.VITE_GIZA_DEV_BUILD;

export const GIZA_DISPLAY_VERSION = devBuild
  ? `${releaseVersion}+dev.${devBuild}`
  : releaseVersion;

declare const __GIZA_BUILD_METADATA__:{commit:string;dirty:boolean;sourceSha256:string;builtAt:string};
export const GIZA_BUILD=typeof __GIZA_BUILD_METADATA__==='undefined'?{commit:'UNKNOWN',dirty:true,sourceSha256:'UNKNOWN',builtAt:'UNKNOWN'}:__GIZA_BUILD_METADATA__;
