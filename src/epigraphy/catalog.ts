export const INSCRIPTION = {
  id:'sphinx.dream-stela',title:'Dream Stela · Thutmose IV',
  context:'The inscribed stela between the Sphinx’s forepaws. These images document the inscription, not the age or internal geometry of the Sphinx.',
  limitation:'Weathering, lighting, historical copying and photographic resolution affect readings. No automatic translation or recovered missing text is claimed.',
};
export const INSCRIPTION_IMAGES = [
  {id:'dream-detail',title:'Dream Stela · carved detail',kind:'Detail photograph',
    image:'/epigraphy/dream-stela-detail.jpg',width:3264,height:2448,
    original:'https://upload.wikimedia.org/wikipedia/commons/8/8b/Gizeh-Stele_du_reve.jpg',
    source:'https://commons.wikimedia.org/wiki/File:Gizeh-Stele_du_reve.jpg',
    author:'Kurohito',date:'2008-04',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',
    note:'Unaltered oblique detail photograph. Perspective and weathering limit sign readings; this is not an orthophoto or a complete line transcription.'},
  {id:'dream-photo',title:'Dream Stela · photograph',kind:'Photograph',
    image:'/epigraphy/dream-stela.jpg',width:1200,height:1600,
    original:'https://upload.wikimedia.org/wikipedia/commons/2/21/Dream-stela.jpg',
    source:'https://commons.wikimedia.org/wiki/File:Dream-stela.jpg',
    author:'HoremWeb',date:'2006-11-06',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',
    note:'Unaltered source photograph. Contrast and grayscale are temporary display adjustments; they do not recover lost marks.'},
  {id:'dream-lepsius',title:'Dream Stela · Lepsius facsimile',kind:'Historical facsimile',
    image:'/epigraphy/dream-stela-lepsius.jpg',width:1268,height:1707,
    original:'https://upload.wikimedia.org/wikipedia/commons/c/cf/Giseh_Traumstele_%28Lepsius%29_01.jpg',
    source:'https://commons.wikimedia.org/wiki/File:Giseh_Traumstele_(Lepsius)_01.jpg',
    author:'Carl Richard Lepsius',date:'1849',license:'Public domain',licenseUrl:'https://creativecommons.org/publicdomain/mark/1.0/',
    note:'Denkmaeler aus Aegypten und Aethiopien, Band V, Neues Reich, plate 69. A historical interpretation—not an independent photograph or ground truth.'},
] as const;
export const EPIGRAPHY_REFERENCES = [
  {title:'TLA · scholarly text corpus & dictionary',url:'https://thesaurus-linguae-aegyptiae.de/search?lang=en'},
  {title:'Unicode 17 · sign character identities (not translations)',url:'https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt'},
  {title:'Digital Rosetta Stone · text / image alignment research',url:'https://www.digital-rosetta-stone.org/'},
];
