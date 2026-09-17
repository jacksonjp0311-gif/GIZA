import { GIZA_DISPLAY_VERSION } from '../version';

export function WorkstationFooter({ keyStructures,sphinx=false }: { keyStructures: number;sphinx?:boolean }) {
  return (
    <footer className="edgeFooter">
      <span>DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP</span>
      <b>△ GIZA // NEXUS · v{GIZA_DISPLAY_VERSION} · {sphinx?'SPHINX':'KHAFRE'} · {keyStructures} {sphinx?'STUDY REGIONS':'KEY STRUCTURES'}</b>
      <span>● STATUS: READY</span>
    </footer>
  );
}
