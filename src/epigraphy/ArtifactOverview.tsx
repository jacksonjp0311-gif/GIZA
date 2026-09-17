import {useState} from 'react';
import {INSCRIPTION,INSCRIPTION_IMAGES} from './catalog';
import {SPHINX_DIMENSIONS} from '../sphinx/specifications';
import './artifact.css';

export type ArtifactOverviewProps={
  zoneCount:number;
  reviewedCount:number;
  onRead:(imageId?:string)=>void;
  onRestore:()=>void;
  onStory:()=>void;
  onModel?:()=>void;
};

function SourceImage({image,alt}:{image:typeof INSCRIPTION_IMAGES[number];alt:string}){
  const [failed,setFailed]=useState(false);
  return failed?<span className="artifactImageFallback">Image unavailable. The source record remains accessible below.</span>:<img src={image.image} alt={alt} width={image.width} height={image.height} onError={()=>setFailed(true)}/>;
}

export function ArtifactOverview({zoneCount,reviewedCount,onRead,onRestore,onStory,onModel}:ArtifactOverviewProps){
  const contextImage=INSCRIPTION_IMAGES.find(image=>image.id==='dream-photo')!;
  const displayHeight=SPHINX_DIMENSIONS.find(dimension=>dimension.id==='stela')!;
  const alternateHeight=SPHINX_DIMENSIONS.find(dimension=>dimension.id==='stela-alt')!;
  return <section className="artifactOverview" aria-labelledby="artifact-title">
    <div className="artifactPage">
      <header className="artifactIntro">
        <div><span className="artifactEyebrow">ARTIFACT WORKSPACE / SPHINX</span><h2 id="artifact-title">{INSCRIPTION.title}</h2><p>{INSCRIPTION.context}</p></div>
        <span className="artifactIdentity">SOURCE-LED STUDY<span>Originals stay original</span></span>
      </header>

      <div className="artifactHero">
        <figure className="artifactPortrait">
          <div className="artifactImageStage"><span className="artifactImageBadge">UNALTERED SOURCE PHOTOGRAPH</span><SourceImage image={contextImage} alt="The Dream Stela photographed between the Sphinx’s forepaws"/></div>
          <figcaption><div><strong>{contextImage.title}</strong><span>{contextImage.author} · {contextImage.date}</span></div><div><a href={contextImage.source} target="_blank" rel="noreferrer">Source record ↗</a><a href={contextImage.licenseUrl} target="_blank" rel="noreferrer">{contextImage.license} ↗</a></div></figcaption>
        </figure>

        <div className="artifactOrientation">
          <section className="artifactBegin" aria-labelledby="artifact-begin-title"><span className="artifactEyebrow">BEGIN WITH WHAT SURVIVES</span><h3 id="artifact-begin-title">Look closely. Build a reading.</h3><p>Choose a source, mark a region and record what you can actually see. Keep proposed readings and missing details separate.</p><div className="artifactActions"><button className="artifactPrimary" onClick={()=>onRead('dream-detail')}>Inspect the carved detail <span aria-hidden="true">→</span></button>{onModel&&<button onClick={onModel}>Locate in the 3D Sphinx</button>}</div></section>

          <section className="artifactDimension" aria-labelledby="artifact-dimension-title"><div className="artifactDimensionHeader"><h3 id="artifact-dimension-title">Height reference</h3><span>PUBLISHED APPROXIMATION</span></div><div className="artifactDimensionValue"><strong>{displayHeight.metres.toFixed(1)} <small>m</small></strong><span>used by the display model</span></div><p>{displayHeight.binding}</p><a href={displayHeight.source} target="_blank" rel="noreferrer">{displayHeight.publisher} ↗</a><div className="artifactConflict"><strong>Unresolved source difference</strong><p><a href={alternateHeight.source} target="_blank" rel="noreferrer">{alternateHeight.publisher} ↗</a> gives approximately {alternateHeight.metres.toFixed(1)} m. These summaries are not a registered survey or a basis for centimetre-level accuracy.</p></div></section>

          <section className="artifactNotebook" aria-labelledby="artifact-notebook-title"><div><h3 id="artifact-notebook-title">Your research notebook</h3><p>Annotations in this session. Export a notebook for a portable backup.</p></div><dl><div><dt>Reading zones</dt><dd>{zoneCount}</dd></div><div><dt>Operator reviewed</dt><dd>{reviewedCount}</dd></div></dl><p className="artifactCaution">An operator review is a recorded attestation—not independent authentication or a validated translation.</p></section>
        </div>
      </div>

      <section className="artifactPathways" aria-labelledby="artifact-pathways-title"><div className="artifactSectionHeading"><div><span className="artifactEyebrow">THREE DISTINCT LAYERS</span><h3 id="artifact-pathways-title">Evidence first. Interpretation visible.</h3></div><p>No confidence score is invented, and a visual prediction never becomes source evidence.</p></div><div className="artifactPathGrid">
        <article className="artifactPath artifactPathEvidence"><span className="artifactLayer">01 / SOURCE MATERIAL</span><h4>Inspect the surviving marks</h4><p>Compare photographs with a historical facsimile. Trace visible contours, note damage and cite the image behind each reading.</p><button onClick={()=>onRead()}>Inspect &amp; translate <span aria-hidden="true">↗</span></button></article>
        <article className="artifactPath artifactPathInterpretation"><span className="artifactLayer">02 / INTERPRETATION</span><h4>Follow the story and its sources</h4><p>Read the historical context separately from your proposed translation. A historical copy is an interpretation, not a photograph of the stone.</p><button onClick={onStory}>Story &amp; sources <span aria-hidden="true">↗</span></button></article>
        <article className="artifactPath artifactPathPrediction"><span className="artifactLayer">03 / PREDICTION · NOT EVIDENCE</span><h4>Explore a color hypothesis</h4><p>Compare a clearly labeled AI color example or paint your own proposal over a separate layer. Record your reasoning and alternatives.</p><button onClick={onRestore}>Restoration hypotheses <span aria-hidden="true">↗</span></button></article>
      </div></section>

      <section className="artifactSources" aria-labelledby="artifact-sources-title"><div className="artifactSectionHeading"><div><span className="artifactEyebrow">SOURCE COLLECTION</span><h3 id="artifact-sources-title">Open the record behind the image</h3></div><p>{INSCRIPTION.limitation}</p></div><div className="artifactSourceGrid">{INSCRIPTION_IMAGES.map(image=><article className="artifactSource" key={image.id}><button className="artifactSourceOpen" onClick={()=>onRead(image.id)} aria-label={`Inspect ${image.title}`}><SourceImage image={image} alt=""/><span><small>{image.kind}</small><strong>{image.title}</strong><span>Open in inspector <span aria-hidden="true">→</span></span></span></button><p>{image.note}</p><footer><span>{image.author} · {image.date}</span><a href={image.source} target="_blank" rel="noreferrer">Source ↗</a><a href={image.licenseUrl} target="_blank" rel="noreferrer">{image.license} ↗</a></footer></article>)}</div></section>

      <p className="artifactFooterNote">Research workspace, not an automatic decipherment. No complete validated translation or recovered missing text is supplied. Notebook edits do not change the archaeological database.</p>
    </div>
  </section>;
}
