/** Conservative identity: do not merge crops or different photographs of one object. */
export function mediaIdentity(value:string):string{
  try{
    const url=new URL(value,'https://giza.local');
    const path=decodeURIComponent(url.pathname).replace(/ /g,'_');
    if(url.hostname==='commons.wikimedia.org'){
      const name=path.match(/\/wiki\/(?:File:|Special:Redirect\/file\/|Special:FilePath\/)(.+)/)?.[1];
      if(name)return 'commons:'+name;
    }
    if(url.hostname==='upload.wikimedia.org'&&path.startsWith('/wikipedia/commons/')){
      const segments=path.split('/');
      return 'commons:'+(segments[3]==='thumb'?segments[6]:segments.at(-1));
    }
    url.hash='';return url.href;
  }catch{return value;}
}
export function uniqueMedia<T extends {image_url:string}>(records:T[]):T[]{
  const seen=new Set<string>();
  return records.filter(record=>{const key=mediaIdentity(record.image_url);if(seen.has(key))return false;seen.add(key);return true;});
}
