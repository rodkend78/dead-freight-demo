# Dead Freight — browser demo

[Play Dead Freight](https://rodkend78.github.io/dead-freight-demo/)

Version 0.28.0. A solo extraction shooter with three connected industrial districts, climbable cover and roofs, eight weapons, recoverable prototype designs and persistent equipment.

Click **Load Dead Freight**, then **Enter the yard**. Select a weapon and press **Enter** to deploy. **WASD** moves, **Space** jumps, **Shift** dodges, mouse aims/fires, **R** reloads, **E** interacts, **Q** heals and **G** throws your fitted utility. Hold **E** at extraction for five seconds to bank your haul. **Escape** pauses, **M** opens the map and **N** cycles guidance. **Inspect Kit** opens a closer three-quarter Character view; rotate it or choose Full Kit / Weapon. The detailed scavenger and five enemy identities feature layered armor, clearer materials and fitted role equipment. The gameplay camera now defaults to 13 m / 38 degrees. Mouse wheel zooms, [ / ] tilts and C resets. Custom camera preferences are preserved.

Arcwell charges a secondary shot on **RMB/LT**. Switchyard charges on **LMB/RT** and pierces up to three enemies. Conductor chains across visible targets. Severance cuts close targets and amber cabinet seams, with a battery and heat limit.

Recover Severance in the east Morrow workshop, Switchyard after collecting the Ironworks gantry shipment and Conductor after depot drainage. Hold E at a field unit, then extract its design to unlock replacements in **Workbench → Prototype Recipes**. **Loadout → Show Prototypes → Track a Field Unit** sets recovery guidance. Recipes persist after later deaths; unbanked recoveries remain at risk.

**More → Squad intelligence** connects an optional Qwen-directed Ironworks squad. It requires an authorized private Tailscale connection and a separate playtest code. Sessions remain in memory for up to one hour; no model credential is included in the game. Ordinary tactics remain playable for other visitors and during model outages. Unity continues to own all movement, perception and combat.

**More → Control settings** remaps fifteen keyboard/mouse actions and shows the controller layout. Standard gamepad input is implemented; automated controller tests use virtual/API-simulated devices. Physical pairing and ergonomics remain unverified.

Progress stays in this browser profile and website origin. **Save backup** downloads it; **More → Restore backup** previews an exported browser or native stash before replacement. Old five-slot saves and current eight-slot saves are supported. Existing saves gain empty prototype slots and locked designs, and are rewritten only by a normal save action. The prior save remains backed up. Automatic cross-device sync is not implemented.

**More → Playtest notes** exports optional local notes and a raid report. Nothing is uploaded. This repository contains the compiled Unity Web export and payload checksums only. The editable project is maintained separately. Player saves, QA profiles and private source are excluded.

Current Chrome connection, squad and regression coverage, and prior Firefox/WebKit engine coverage, are recorded in the private release validation. Shipping Safari, mobile/touch input and broad hardware acceptance remain unverified. Automated pilot results do not establish human difficulty or engagement.
