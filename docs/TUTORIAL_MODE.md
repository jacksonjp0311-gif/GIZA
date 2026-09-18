# Tutorial mode — 0.12.0 implementation checkpoint

The permanent **Tutorial / ?** header button starts the real-interface tour.
The first-use welcome is an inline header row, not an overlay covering research
controls. Explore on my own dismisses it without starting a tour.

## Curriculum

Fifteen chapters cover welcome and evidence limits; the main workstation;
rotate/zoom/pan/views; reality layers; component inspection; Atlas; Evidence
Assembly; measurements; sections; evidence graph; investigations; registration;
Sphinx and Inscription Lab; saving/replay; and independent exploration.

The tour explains existing capabilities. It does not perform registrations,
create observations, silently navigate to missing workspaces, or simulate picks.
Click-driven steps advance only after the real target is clicked and the
destination is present. Global draft protection applies to those clicks.

## Implementation

Content lives in src/tutorial/curriculum.ts. Each target is a stable
data-tutorial-id, never an nth-child selector. Four surrounding backdrop regions
leave the real control clickable. A separate pointer-transparent rounded outline
adds breathing space. The popover chooses available adjacent space and stays
within the viewport. If no target or suitable space exists, the guide explains
the limitation and permits skipping. Missing optional data is not replaced by a
fake target.

ResizeObserver, resize/scroll events and filtered layout mutations schedule one
coalesced requestAnimationFrame update. There is no continuous animation-frame
layout loop. The optional tutorialDiagnostics query measures layout work without
changing research inputs.

## Accessibility

The popover is a labelled region with a live explanation. Tab and Shift+Tab
reach both real highlighted controls and tutorial actions. Enter/Space retain
native control behavior. Escape exits and restores prior focus. Visible focus
and reduced-motion scrolling are retained. Chapters, Back, Next, Skip chapter,
Restart and Exit are ordinary labelled controls. Instructional steps do not
require mouse-only gestures to advance.

## Presentation-only storage

giza.tutorial.v1 stores version, step, active, dismissed and completed step IDs.
It is bounded and validated on load. It is not an evidence schema, receipt,
campaign, canonical assembly or calculation dependency. Clearing it resets only
guidance preferences. Closing help does not clear research drafts.

## Adding a step

1. Put a unique semantic data-tutorial-id on the actual control.
2. Add a curriculum entry with stable id, chapter, target, title, short text and
   instruction.
3. For an action step add click:true and, for navigation, the destination after
   target. Do not invoke application actions from the tutorial engine.
4. Use the existing navigation boundary for any destructive workspace action.
5. Add real pointer/keyboard and narrow-layout coverage.

TeachButton launches a chapter through this same engine; it is not a second
help system. Current automated coverage and limitations are recorded in
verification/live-evidence-012 and VALIDATION.md. Screenshots alone do not
certify accessibility or interaction.
