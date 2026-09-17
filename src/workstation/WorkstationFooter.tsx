import { GIZA_DISPLAY_VERSION } from '../version';

export function WorkstationFooter({ keyStructures }: { keyStructures: number }) {
  return (
    <footer className="edgeFooter">
      <span>DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP</span>
      <b>△ GIZA // NEXUS · v{GIZA_DISPLAY_VERSION} · KHAFRE · {keyStructures} KEY STRUCTURES</b>
      <span>● STATUS: READY</span>
    </footer>
  );
}
