// Published summary constraints, not a registered surface or independent survey.
export const SPHINX_DIMENSIONS=[
  {id:'length',label:'Overall length',metres:73.5,source:'https://sis.gov.eg/en/egypt/tourism/landmarks/sphinx/',publisher:'Egyptian State Information Service',binding:'Approximate display envelope: rear −33 to forepaw +40.5 m.'},
  {id:'width',label:'Overall width',metres:19.3,source:'https://sis.gov.eg/en/egypt/tourism/landmarks/sphinx/',publisher:'Egyptian State Information Service',binding:'Approximate display envelope across the hindquarters. Not a fitted cross-section.'},
  {id:'height',label:'Overall height',metres:20,source:'https://sis.gov.eg/en/egypt/tourism/landmarks/sphinx/',publisher:'Egyptian State Information Service',binding:'Approximate study datum to crown; absolute ground datum is unregistered.'},
  {id:'stela',label:'Dream Stela height',metres:3.5,source:'https://arce.org/resource/long-hidden-arce-sphinx-mapping-project-unveiled/',publisher:'American Research Center in Egypt',binding:'Source-reported height constrains the new rounded-top display mesh. Width, thickness and placement remain schematic.'},
  {id:'stela-alt',label:'Stela height · alternate summary',metres:3.6,source:'https://giza.fas.harvard.edu/gizaintro/',publisher:'Digital Giza · Harvard',binding:'Alternative approximate published height. This difference is unresolved; the display uses ARCE’s 3.5 m, not a claim of survey precision.'},
] as const;
