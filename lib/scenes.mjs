/* Illustrated scenes standing in for installation photographs.
 *
 * These occupy the slots real job photos belong in, so the page can be judged
 * with imagery in it before any exist. They are deliberately drawn rather than
 * photographic: a trade site that shows stock photos of other firms' work is
 * a site a customer can catch out. Every one is captioned as an illustration.
 *
 * Replace them job by job — see content/gallery.json, where any entry gaining
 * a `photo` field renders the photograph instead of the drawing.
 *
 * Unlike the line drawings in illustrations.mjs, these carry their own fixed
 * palette rather than theme tokens. They behave like photographs: the same
 * picture on a light or a dark page.
 */

const P = {
  wall: "#e7e1d6", wallShade: "#d9d2c5", trim: "#f6f2ec",
  floor: "#c49a70", floorDark: "#ab825b",
  sky: "#bcd9e9", glass: "#cfe4ef",
  unit: "#fbfcfd", unitLine: "#c3cfd8", unitVent: "#dde6ec",
  soft: "#4c6c7d", softDark: "#3d5866",
  warm: "#e0a352", warmDark: "#c68a3f",
  brick: "#b08268", brickDark: "#95684f",
  green: "#6f8f63", greenDark: "#57724d",
  metal: "#d3dae0", metalDark: "#aab6c0",
  ink: "#2f3a42", flow: "#2fa6c4"
};

const scene = (label, body) => `
<svg class="scene-art" viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice" aria-label="${label}">
${body}
</svg>`;

/* A wall unit high on the wall, seen from inside the room. */
const indoorUnit = (x, y, w = 116) => `
  <rect x="${x}" y="${y}" width="${w}" height="26" rx="6" fill="${P.unit}" stroke="${P.unitLine}" stroke-width="1.5"/>
  <rect x="${x + 8}" y="${y + 15}" width="${w - 16}" height="6" rx="3" fill="${P.unitVent}"/>
  <path d="M${x + 8} ${y + 8}h${w - 30}" stroke="${P.unitLine}" stroke-width="1.2"/>
  <path class="scene-flow" d="M${x + 20} ${y + 34}c-3 10-10 17-19 21M${x + w / 2} ${y + 36}c-1 11-6 19-14 25"
        fill="none" stroke="${P.flow}" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>`;

const plant = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0h26v-22H0z" fill="${P.warm}"/>
    <path d="M2 -22h22l-3 24H5z" fill="${P.warmDark}" opacity=".35"/>
    <path d="M13 -22c-2-18-12-24-12-24s12 2 12 20c0-18 12-20 12-20s-10 6-12 24z" fill="${P.green}"/>
    <path d="M13 -22c-1-12 5-20 5-20s-1 12-3 20z" fill="${P.greenDark}"/>
  </g>`;

const SCENES = {
  /* Living room — the most-requested single-room job. */
  "living-room": scene(
    "Illustration of a living room with a wall-mounted air conditioning unit fitted above the sofa, blowing cool air into the room",
    `<rect width="400" height="300" fill="${P.wall}"/>
     <rect y="232" width="400" height="68" fill="${P.floor}"/>
     <rect y="224" width="400" height="10" fill="${P.trim}"/>
     <rect x="34" y="54" width="104" height="150" rx="3" fill="${P.glass}" stroke="${P.trim}" stroke-width="7"/>
     <path d="M86 54v150M34 129h104" stroke="${P.trim}" stroke-width="5"/>
     <rect x="150" y="42" width="18" height="182" fill="${P.wallShade}" opacity=".5"/>
     ${indoorUnit(212, 62, 130)}
     <ellipse cx="250" cy="252" rx="120" ry="16" fill="${P.floorDark}" opacity=".35"/>
     <rect x="188" y="168" width="164" height="56" rx="10" fill="${P.soft}"/>
     <rect x="196" y="150" width="70" height="30" rx="7" fill="${P.softDark}"/>
     <rect x="274" y="150" width="70" height="30" rx="7" fill="${P.softDark}"/>
     <path d="M198 224v14M342 224v14" stroke="${P.ink}" stroke-width="5" stroke-linecap="round"/>
     ${plant(56, 224, 1.2)}
     <rect x="360" y="120" width="4" height="104" fill="${P.metalDark}"/>
     <path d="M348 120h28l-6-22h-16z" fill="${P.warm}"/>`
  ),

  /* Bedroom — the loft-bakes-in-summer job. */
  "bedroom": scene(
    "Illustration of a bedroom with a wall-mounted air conditioning unit fitted on the side wall above a bedside table",
    `<rect width="400" height="300" fill="${P.wall}"/>
     <rect y="238" width="400" height="62" fill="${P.floor}"/>
     <rect y="230" width="400" height="10" fill="${P.trim}"/>
     <rect x="248" y="58" width="112" height="130" rx="3" fill="${P.glass}" stroke="${P.trim}" stroke-width="7"/>
     <path d="M304 58v130" stroke="${P.trim}" stroke-width="5"/>
     ${indoorUnit(46, 66, 122)}
     <rect x="34" y="128" width="18" height="110" rx="5" fill="${P.softDark}"/>
     <rect x="52" y="196" width="176" height="42" rx="5" fill="${P.trim}"/>
     <rect x="52" y="176" width="176" height="24" rx="8" fill="${P.soft}"/>
     <rect x="62" y="156" width="58" height="24" rx="7" fill="${P.trim}" stroke="${P.wallShade}" stroke-width="1.5"/>
     <rect x="126" y="156" width="58" height="24" rx="7" fill="${P.trim}" stroke="${P.wallShade}" stroke-width="1.5"/>
     <path d="M60 238v10M222 238v10" stroke="${P.ink}" stroke-width="5" stroke-linecap="round"/>
     <rect x="246" y="198" width="52" height="40" rx="4" fill="${P.floorDark}"/>
     <path d="M246 214h52" stroke="${P.floor}" stroke-width="2"/>
     <path d="M270 198v-14" stroke="${P.metalDark}" stroke-width="3"/>
     <path d="M258 184h24l-5-18h-14z" fill="${P.warm}"/>
     ${plant(348, 238, .95)}`
  ),

  /* Kitchen extension — glazed, south-facing, the classic overheating room. */
  "kitchen-extension": scene(
    "Illustration of an open-plan kitchen extension with bifold doors, a roof light and a ceiling cassette unit fitted flush into the ceiling",
    `<rect width="400" height="300" fill="${P.wall}"/>
     <rect y="240" width="400" height="60" fill="${P.floorDark}"/>
     <rect width="400" height="46" fill="${P.trim}"/>
     <path d="M96 0h128v46H96z" fill="${P.sky}"/>
     <path d="M96 46 76 118h168l-20-72z" fill="${P.sky}" opacity=".28"/>
     <rect x="150" y="46" width="86" height="16" rx="4" fill="${P.unit}" stroke="${P.unitLine}" stroke-width="1.5"/>
     <rect x="160" y="51" width="66" height="6" rx="3" fill="${P.unitVent}"/>
     <path class="scene-flow" d="M156 70c-10 8-16 18-18 30M230 70c10 8 16 18 18 30M193 68v34"
           fill="none" stroke="${P.flow}" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>
     <rect x="286" y="60" width="106" height="180" rx="3" fill="${P.glass}" stroke="${P.trim}" stroke-width="6"/>
     <path d="M321 60v180M356 60v180" stroke="${P.trim}" stroke-width="5"/>
     <rect x="40" y="150" width="176" height="24" rx="4" fill="${P.ink}"/>
     <rect x="46" y="174" width="164" height="66" fill="${P.soft}"/>
     <path d="M100 174v66M156 174v66" stroke="${P.softDark}" stroke-width="3"/>
     <circle cx="73" cy="196" r="4" fill="${P.metal}"/>
     <circle cx="128" cy="196" r="4" fill="${P.metal}"/>
     <circle cx="183" cy="196" r="4" fill="${P.metal}"/>
     ${plant(238, 240, 1.1)}`
  ),

  /* The rear elevation — the shot that sells the job to a nervous neighbour. */
  "rear-elevation": scene(
    "Illustration of the rear elevation of a brick house with the outdoor condenser unit mounted neatly on wall brackets above a kitchen extension roof, pipework boxed in trunking",
    `<rect width="400" height="300" fill="${P.sky}"/>
     <rect y="30" width="400" height="270" fill="${P.brick}"/>
     <g stroke="${P.brickDark}" stroke-width="1.1" opacity=".55">
       <path d="M0 54h400M0 78h400M0 102h400M0 126h400M0 150h400M0 174h400M0 198h400M0 222h400"/>
       <path d="M40 30v24M120 30v24M200 30v24M280 30v24M360 30v24M80 54v24M160 54v24M240 54v24M320 54v24
                M40 78v24M120 78v24M200 78v24M280 78v24M360 78v24M80 102v24M160 102v24M240 102v24M320 102v24
                M40 126v24M120 126v24M200 126v24M280 126v24M360 126v24M80 150v24M160 150v24M240 150v24M320 150v24"/>
     </g>
     <rect x="42" y="66" width="86" height="98" rx="2" fill="${P.glass}" stroke="${P.trim}" stroke-width="6"/>
     <path d="M85 66v98" stroke="${P.trim}" stroke-width="5"/>
     <rect x="224" y="238" width="176" height="62" fill="${P.wallShade}"/>
     <rect x="216" y="230" width="192" height="12" rx="3" fill="${P.metalDark}"/>
     <rect x="238" y="120" width="112" height="76" rx="6" fill="${P.metal}" stroke="${P.ink}" stroke-width="2"/>
     <circle cx="294" cy="160" r="26" fill="none" stroke="${P.metalDark}" stroke-width="2.5"/>
     <circle cx="294" cy="160" r="15" fill="none" stroke="${P.metalDark}" stroke-width="2"/>
     <circle cx="294" cy="160" r="5" fill="${P.ink}"/>
     <path d="M248 130h92M248 138h92" stroke="${P.metalDark}" stroke-width="2"/>
     <path d="M232 132h6v52h-6zM350 132h6v52h-6z" fill="${P.ink}" opacity=".55"/>
     <rect x="214" y="126" width="14" height="104" rx="4" fill="${P.trim}" opacity=".9"/>
     <path d="M221 126v104" stroke="${P.metalDark}" stroke-width="1.2" opacity=".6"/>
     <rect x="176" y="30" width="12" height="200" fill="${P.brickDark}" opacity=".5"/>
     ${plant(56, 292, 1.35)}`
  ),

  /* Loft bedroom — sloped ceiling, no wall to hang a unit on. */
  "loft-room": scene(
    "Illustration of a loft bedroom with a sloping ceiling and a dormer window, with a floor-standing console unit fitted beneath the window",
    `<rect width="400" height="300" fill="${P.wallShade}"/>
     <path d="M0 300V150L150 30h250v270z" fill="${P.wall}"/>
     <path d="M0 150 150 30" stroke="${P.trim}" stroke-width="6"/>
     <rect y="252" width="400" height="48" fill="${P.floor}"/>
     <rect y="244" width="400" height="10" fill="${P.trim}"/>
     <rect x="236" y="76" width="116" height="106" rx="3" fill="${P.glass}" stroke="${P.trim}" stroke-width="7"/>
     <path d="M294 76v106M236 129h116" stroke="${P.trim}" stroke-width="5"/>
     <rect x="248" y="190" width="98" height="54" rx="6" fill="${P.unit}" stroke="${P.unitLine}" stroke-width="1.5"/>
     <rect x="258" y="198" width="78" height="7" rx="3.5" fill="${P.unitVent}"/>
     <path d="M258 214h78M258 222h78" stroke="${P.unitLine}" stroke-width="1.4"/>
     <rect x="258" y="230" width="78" height="7" rx="3.5" fill="${P.unitVent}"/>
     <path class="scene-flow" d="M240 204c-14 3-24 9-30 18M240 226c-16 2-28 7-38 13"
           fill="none" stroke="${P.flow}" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>
     <rect x="20" y="150" width="16" height="94" rx="5" fill="${P.softDark}"/>
     <rect x="36" y="206" width="152" height="38" rx="5" fill="${P.trim}"/>
     <rect x="36" y="188" width="152" height="22" rx="7" fill="${P.soft}"/>
     <rect x="46" y="170" width="52" height="21" rx="6" fill="${P.trim}" stroke="${P.wallShade}" stroke-width="1.5"/>
     <rect x="104" y="170" width="52" height="21" rx="6" fill="${P.trim}" stroke="${P.wallShade}" stroke-width="1.5"/>`
  ),

  /* Office — the commercial side of the catalogue. */
  "office": scene(
    "Illustration of an open-plan office with a ceiling cassette unit set flush into a suspended ceiling above two desks",
    `<rect width="400" height="300" fill="${P.wall}"/>
     <rect width="400" height="52" fill="${P.trim}"/>
     <path d="M0 52h400" stroke="${P.wallShade}" stroke-width="3"/>
     <path d="M60 0v52M140 0v52M220 0v52M300 0v52" stroke="${P.wallShade}" stroke-width="2"/>
     <rect y="246" width="400" height="54" fill="${P.floorDark}" opacity=".7"/>
     <rect x="152" y="30" width="96" height="22" rx="4" fill="${P.unit}" stroke="${P.unitLine}" stroke-width="1.5"/>
     <rect x="164" y="37" width="72" height="8" rx="4" fill="${P.unitVent}"/>
     <path class="scene-flow" d="M148 60c-12 8-20 18-24 30M252 60c12 8 20 18 24 30M200 58v36"
           fill="none" stroke="${P.flow}" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>
     <rect x="300" y="80" width="90" height="140" rx="3" fill="${P.glass}" stroke="${P.trim}" stroke-width="6"/>
     <path d="M345 80v140" stroke="${P.trim}" stroke-width="5"/>
     <rect x="30" y="192" width="120" height="12" rx="3" fill="${P.floor}"/>
     <path d="M38 204v42M142 204v42" stroke="${P.metalDark}" stroke-width="5" stroke-linecap="round"/>
     <rect x="62" y="154" width="56" height="34" rx="3" fill="${P.ink}"/>
     <path d="M86 188v6h8v-6z" fill="${P.metalDark}"/>
     <rect x="170" y="192" width="120" height="12" rx="3" fill="${P.floor}"/>
     <path d="M178 204v42M282 204v42" stroke="${P.metalDark}" stroke-width="5" stroke-linecap="round"/>
     <rect x="202" y="154" width="56" height="34" rx="3" fill="${P.ink}"/>
     <path d="M226 188v6h8v-6z" fill="${P.metalDark}"/>
     <rect x="156" y="150" width="8" height="54" rx="3" fill="${P.soft}" opacity=".45"/>`
  )
};

export const sceneArt = (name) => SCENES[name] || "";
export const sceneNames = Object.keys(SCENES);
