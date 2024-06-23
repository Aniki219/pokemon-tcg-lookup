# Pokemon TCG Card Lookup

A Chrome extension which allows you to quickly and easily lookup any card in Standard play and read it's text.
The data for this extension comes from the [Pokemon TCG API](pokemontcg.io).

You can pull up this extension while watching TCG match videos and read card descriptions without navigating to another window or tab.
Hotkey this extension for ease of use.

## Screenshots

![](https://github.com/Aniki219/pokemon-tcg-lookup/raw/main/public/screenshots/Window.png | width: 600)

![](https://github.com/Aniki219/pokemon-tcg-lookup/raw/main/public/screenshots/Usage.png | width: 640)

## Installation

Clone or download this repository. 
Run `npm install` in your command line in the `pokemon-tcg-lookup` directory.
You should see a directory named `dist` has been generated.

In Chrome navigate to [Manage Your Extensions](`chrome://extensions/`).
Click `Load Unpacked` and select the `dist` directory.

Optionally, go to `Keyboard Shortcuts` and add a shortcut such as `Alt+P` to open the extension.

### Usage

When you first open the extension it will fetch all of the card name data from the [TCG API](pokemontcg.io). This will enable auto-complete suggestions in the search bar. 
This will only need to run once when you first open the extension, and then it will check for newly released sets and update automatically the next time you open the extension if a new set is released.

You can click the `Resync` button to manually fetch card name data if you notice card names are missing.

You can search for exact names or name fragments. If there are multiple results, you can click on the arrows under the search bar to scroll through cards.

Example searches:
 - `Radiant Alakazam`: returns a single card.
 - `Radiant Charizard`: returns two of the same card with different art.
 - `Char`: returns 55 hits for different cards `Charjabug`, `Giovanni's Charisma`, `Bravery Charm`, `Radiant Charizard`, etc...
 - `Vmax` returns all VMax Pokemon.
