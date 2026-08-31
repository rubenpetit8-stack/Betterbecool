/* Line drawings of the kit we install.
 *
 * A customer choosing between a wall unit, a floor console and a ducted system
 * is choosing between things they cannot picture from a name. These sit on the
 * price cards so the choice is visual, and they carry no photographic claim —
 * nothing here pretends to be a job we have done. Swap in real photographs of
 * real installations as soon as you have them; see the README.
 *
 * Everything strokes with currentColor and fills from theme tokens, so the
 * drawings follow light and dark like the rest of the page.
 */

const svg = (label, body) => `
<svg class="unit-art" viewBox="0 0 240 150" role="img" aria-label="${label}">
${body}
</svg>`;

/* Three arcs blowing away from an outlet — the shared visual language for air
   movement across all six drawings. */
const flow = (paths) =>
  paths.map((d, i) => `<path class="art-flow" d="${d}" style="opacity:${1 - i * 0.28}"/>`).join("");

const ART = {
  /* Indoor unit high on a wall, the standard fit. */
  "wall-split": svg(
    "A slim wall-mounted indoor unit fitted high on a wall, blowing air down into the room",
    `<path class="art-faint" d="M18 22h204"/>
     <rect class="art-body" x="34" y="38" width="172" height="42" rx="9"/>
     <path class="art-faint" d="M46 50h96"/>
     <path class="art-faint" d="M46 58h72"/>
     <rect class="art-accent" x="46" y="66" width="148" height="9" rx="4"/>
     <circle class="art-accent" cx="196" cy="54" r="3.5"/>
     ${flow([
       "M78 92c-6 12-18 20-32 24",
       "M112 94c-4 14-14 24-28 30",
       "M146 94c0 16-8 28-20 36"
     ])}`
  ),

  /* Sits at skirting height where there is no usable wall. */
  "console": svg(
    "A floor-standing console unit at skirting height beneath a window",
    `<path class="art-faint" d="M18 128h204"/>
     <path class="art-faint" d="M150 20h58v56h-58z"/>
     <rect class="art-body" x="40" y="60" width="86" height="68" rx="8"/>
     <rect class="art-accent" x="50" y="70" width="66" height="8" rx="4"/>
     <path class="art-faint" d="M50 88h66M50 96h66M50 104h46"/>
     <rect class="art-accent" x="50" y="114" width="66" height="7" rx="3.5"/>
     ${flow([
       "M132 74c14-2 26-8 34-16",
       "M132 90c18 0 34-4 48-12",
       "M132 118c16 4 34 4 50 0"
     ])}`
  ),

  /* Flush into a ceiling, blowing to four sides. */
  "cassette": svg(
    "A ceiling cassette set flush into a ceiling, blowing air out to four sides",
    `<path class="art-faint" d="M14 46h212"/>
     <path class="art-body" d="M74 46h92l22 26H52z"/>
     <rect class="art-accent" x="86" y="54" width="68" height="10" rx="3"/>
     <path class="art-faint" d="M100 46v8M140 46v8"/>
     ${flow([
       "M56 76c-14 6-26 16-32 28",
       "M120 78v34",
       "M184 76c14 6 26 16 32 28"
     ])}`
  ),

  /* Concealed above the ceiling; only a slim grille shows. */
  "ducted": svg(
    "A fan coil concealed in a ceiling void, ducted to a slim grille in the ceiling below",
    `<path class="art-faint" d="M14 34h212M14 82h212"/>
     <path class="art-fill-faint" d="M14 34h212v48H14z"/>
     <rect class="art-body" x="34" y="42" width="80" height="32" rx="5"/>
     <path class="art-faint" d="M44 50h60M44 58h60M44 66h38"/>
     <path class="art-line" d="M114 50h44c8 0 8 4 8 8v16"/>
     <path class="art-line" d="M114 66h30c8 0 8 4 8 8v8"/>
     <rect class="art-accent" x="140" y="82" width="52" height="8" rx="3"/>
     ${flow([
       "M150 98c-4 12-4 22 0 32",
       "M166 100v32",
       "M182 98c4 12 4 22 0 32"
     ])}`
  ),

  /* The box that goes outside — the part planning cares about. */
  "condenser": svg(
    "An outdoor condenser unit on wall brackets, with its fan grille and side louvres",
    `<path class="art-faint" d="M28 14v122"/>
     <path class="art-fill-faint" d="M28 14h14v122H28z"/>
     <path class="art-line" d="M42 56h18M42 106h18"/>
     <rect class="art-body" x="58" y="40" width="140" height="82" rx="8"/>
     <circle class="art-faint" cx="128" cy="82" r="30"/>
     <circle class="art-faint" cx="128" cy="82" r="20"/>
     <circle class="art-accent" cx="128" cy="82" r="8"/>
     <path class="art-faint" d="M68 50h120M68 58h120"/>
     <path class="art-line" d="M198 66h16M198 78h16"/>
     ${flow(["M214 62c10 6 14 14 14 24", "M214 82h16"])}`
  ),

  /* Why a multi-split is the answer when four boxes outside is not. */
  "multi": svg(
    "One outdoor unit connected by pipework to three indoor units in separate rooms",
    `<rect class="art-body" x="26" y="26" width="62" height="26" rx="5"/>
     <rect class="art-accent" x="34" y="44" width="46" height="5" rx="2.5"/>
     <rect class="art-body" x="26" y="72" width="62" height="26" rx="5"/>
     <rect class="art-accent" x="34" y="90" width="46" height="5" rx="2.5"/>
     <rect class="art-body" x="26" y="118" width="62" height="26" rx="5"/>
     <rect class="art-accent" x="34" y="136" width="46" height="5" rx="2.5"/>
     <path class="art-line" d="M88 39h34v46M88 85h34M88 131h34V85"/>
     <path class="art-line" d="M122 85h26"/>
     <rect class="art-body" x="148" y="58" width="68" height="54" rx="7"/>
     <circle class="art-faint" cx="182" cy="85" r="19"/>
     <circle class="art-accent" cx="182" cy="85" r="6"/>
     <path class="art-faint" d="M156 66h52"/>`
  )
};

export const unitArt = (kind) => (kind && ART[kind]) || "";

/* ---------------------------------------------------------------------------
 * Where the outdoor unit goes.
 *
 * This is the first question every customer asks and the one most installers
 * are vague about, so it gets a drawing rather than a paragraph: a London
 * terrace in section, condenser on the rear elevation above the extension
 * roof, short pipe runs up to two bedrooms.
 */
export const housePlacementDiagram = () => `
<svg class="house-art" viewBox="0 0 740 340" role="img"
     aria-label="Cross-section of a London terraced house: the outdoor condenser sits on the rear wall above the kitchen extension roof, out of sight from the street, with short pipe runs to indoor units in the two bedrooms above.">
  <path class="art-line" d="M150 306h470"/>

  <!-- main house -->
  <path class="art-body" d="M210 96h190v210H210z"/>
  <path class="art-body" d="M198 96 305 40l107 56z"/>
  <path class="art-faint" d="M210 186h190"/>

  <!-- windows: street side left, garden side right -->
  <rect class="art-faint-fill" x="234" y="122" width="46" height="42" rx="3"/>
  <rect class="art-faint-fill" x="330" y="122" width="46" height="42" rx="3"/>
  <rect class="art-faint-fill" x="234" y="212" width="46" height="46" rx="3"/>
  <path class="art-faint" d="M257 122v42M234 143h46M353 122v42M330 143h46M257 212v46M234 235h46"/>

  <!-- rear extension -->
  <path class="art-body" d="M400 236h104v70H400z"/>
  <rect class="art-faint-fill" x="426" y="256" width="52" height="40" rx="3"/>

  <!-- indoor units on the bedroom walls -->
  <rect class="art-unit" x="234" y="108" width="46" height="11" rx="4"/>
  <rect class="art-unit" x="330" y="108" width="46" height="11" rx="4"/>

  <!-- condenser on the rear wall, clear of the extension roof -->
  <rect class="art-body" x="406" y="172" width="68" height="48" rx="5"/>
  <circle class="art-faint" cx="440" cy="196" r="16"/>
  <circle class="art-accent" cx="440" cy="196" r="5"/>
  <path class="art-line" d="M474 182h10M474 210h10"/>

  <!-- pipe runs up to each bedroom -->
  <path class="art-pipe" d="M406 184h-14c-8 0-8-6-8-14v-56h-8"/>
  <path class="art-pipe" d="M406 208h-28c-10 0-10-8-10-18v-76h-88"/>

  <g class="art-label">
    <path class="art-leader" d="M158 113h68"/>
    <text x="150" y="110" text-anchor="end">Bedrooms</text>
    <text x="150" y="128" text-anchor="end" class="art-label-sub">Short pipe runs</text>

    <path class="art-leader" d="M540 196h-58"/>
    <text x="548" y="192">Condenser on the rear wall</text>
    <text x="548" y="210" class="art-label-sub">Out of sight from the street</text>

    <path class="art-leader" d="M540 276h-28"/>
    <text x="548" y="281">Kitchen extension</text>

    <text x="305" y="332" text-anchor="middle" class="art-label-sub">Street at the front · garden at the back</text>
  </g>
</svg>`;
