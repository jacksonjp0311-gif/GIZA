# Great Sphinx exterior study explorer

## Open it

Choose **Sphinx 3D** in Project Explorer or **Sphinx** in Quick Views. This opens a dedicated workspace, with no Khafre-specific controls, coordinates or evidence counts. Return with **Khafre pyramid**. Compilation/versioning uses the existing launcher.

## Available inspection

- Ten selectable regions: body, chest/neck, head/face, headdress, two forelegs/paws, hindquarters, tail, Dream Stela and repair masonry study.
- Animated 0–200% exploded inspection; assemble and fit actions. Changing explosion does not continually override manual orbit/zoom. Click Fit view after changing the explosion distance if needed.
- Visibility per region, isolation, front/side/top/perspective cameras, damping, zoom-to-cursor, panning and optional turntable. Reduced motion suppresses turntable and makes exploded transitions immediate.
- Procedural limestone surface shading, schematic geology palette, wireframe, approximate overall dimensions and an uncapped north/south clipping plane.
- 250 independently selectable instanced repair-study blocks. Selection highlights the block and reports a synthetic display index/course. They are not identified historical stones.
- Expanded viewing, source/limitation panel, JSON view-state export and GLB pose export. GLB includes visible geometry/base materials, source links and illustrative-authority metadata. Shader grain, HTML dimensions and clipping are not baked. Export converts the local Z-up study to standard glTF Y-up (X east, Y up, -Z north). It is not a metric survey deliverable.

## Photo-informed refinement — 2026-09-17

- Replaced stacked chest/neck spheres and rounded foreleg/toe primitives with continuous capped profile meshes. The body has a lower, broader back with deterministic weathered beds; the paws have flattened tops and inset toe separations.
- Reworked the head's crown, jaw, brows, eye recesses, lips and damaged nasal area; the headdress uses curved flared surfaces with shallow bands instead of a thick extruded outline and floating lines. Profiles are manually interpreted, not measured from the photos. Hindquarter primitives and tail remain simplified; anatomical regions still overlap and are not a single fused, print-ready watertight monument.
- Added **Compare photos**: two locally bundled unchanged reference photographs, a photo selector, 100–300% photo zoom, source/license credits and a model-focus action. On desktop the photograph and model sit side by side; narrow screens stack a scrollable reference desk below the model.
- **Focus selected in context** fits the selected region without hiding the rest. **Isolate selected** remains separate. **Fit view** returns to whole-assembly framing unless isolation is active. The explosion drawer collapses for focused close-ups and can be reopened.
- Improved lighting/shadow bias and filtered high-frequency stone shading by screen footprint. There is no distance-opacity fade. Geology colors now include chest/head/headdress; those color zones remain schematic.
- Sphinx and inscription workspaces load on demand, with loading/failure recovery. This is an initial bundle split, not a complete performance overhaul. Inscription source images, review boundaries and local drafts remain unchanged. Escape inside the inscription dialog does not reset the Sphinx workspace behind it.

Photo credits and unchanged-byte hashes: `public/sphinx/SOURCES.md`. Jorge Láscar's 2012 photograph (CC BY 2.0) supplies body/paw visual context; Ad Meskens's 2011 photograph (CC BY-SA 3.0) supplies face/headdress visual context. Images have not been texture-projected or converted into metric control points.

JSON export records the selected camera preset/focus and study controls, not the precise manually orbited camera pose. Camera replay/import remains future work.

## Evidence and limits

The Dream Stela selection now offers **Explore this artifact** and **Stela + source photo**. The artifact overview can also open this isolated 3D/photo pairing directly from the Khafre Quick Views lab entry. HoremWeb's already bundled inscription photograph is reused with its existing credit and unchanged hash; this is a third reference-desk option, not a newly acquired photograph. The stela's procedural material omits limestone bedding bands, and its small face does not receive the monument-scale shadow map (which caused false stripes). It still casts a shadow. The published-height label is positioned above the object rather than across it. Neither the material nor the photograph is a mapped relief or calibrated texture.

The shape is a hand-parameterized exterior reconstruction, not a licensed scan or registered photogrammetric model. Approximate overall length/height follow the [Egyptian State Information Service summary](https://sis.gov.eg/en/egypt/tourism/famous-cities/giza/). All local sculptural profiles and coordinates remain illustrative. The small discrepancy from bevels does not imply a measured monument dimension.

The Sphinx core is carved bedrock. Exploding its anatomical regions is an educational inspection operation, not a construction-sequence claim. [AERA's geology account](https://aeraweb.org/geology-of-the-sphinx/) distinguishes three members and documents repair history. The rendered boundaries, erosion and block layout are schematic; they do not reproduce a structural-geological survey.

The [Ministry's monument account](https://egymonuments.gov.eg/monuments/the-great-sphinx/) describes the monument and Dream Stela. The stela is an uninscribed display envelope. No intact nose/beard, underground rooms or speculative tunnels are added.

The [AERA/ARCE archive](https://aeraweb.org/publications/data/) provides plans, elevations, restoration drawings and photographs for a future registered version. Archive availability does not mean those records have been imported, licensed for redistribution, or calibrated here. AERA assets are linked, not repackaged. The separately licensed Commons reference photographs above are bundled with attribution.

[AERA's Sphinx project account](https://aeraweb.org/projects/sphinx/) documents the 1979–1983 survey and later photogrammetry/laser/drone recording. This is a promising acquisition path, not evidence that GIZA has acquired that scan. No distributable, scaled monument scan has been integrated in this pass.

## Next fidelity gate

### Published dimensions and Dream Stela — 2026-09-17

**Dimensions & accuracy** exposes source links and binding limits for SIS's approximately 73.5 m length, 19.3 m width and 20 m height. The hindquarter display envelope was adjusted to the published width. These overall constraints do not validate the anatomical profiles or individual stones. Foreleg-length endpoint definitions still need reconciliation with survey plans.

The Dream Stela now uses a rounded-top mesh constrained to ARCE's reported 3.5 m height. Harvard Digital Giza's alternative approximate 3.6 m summary is retained visibly as unresolved. Width, thickness and placement remain illustrative. It is an uninscribed envelope, not a photo-registered relief. The adjacent Hieroglyphs entry opens the original photographs, translation board, prediction workspace and historical context without projecting generated glyphs onto the measured model.

- SIS dimensions: https://sis.gov.eg/en/egypt/tourism/landmarks/sphinx/
- ARCE stela/context: https://arce.org/resource/long-hidden-arce-sphinx-mapping-project-unveiled/
- Alternative summary: https://giza.fas.harvard.edu/gizaintro/

Acquire source bytes and rights receipts; register independent plan/elevation controls through the existing validated engine; record fit residuals and holdouts; replace each study region with a calibrated surface; bind repair stones to original record identifiers and restoration phases. Only then can geometry gain survey authority. Existing canonical Khafre geometry remains untouched.
