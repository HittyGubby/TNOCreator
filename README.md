## TNOCreator
*PLANNED TNO customized showcase generator..? By a total frontend noob(

### Installation

(Im not sure if anyone would really deploy this)

0. Clone Repo **used git lfs for database files, so you need to install git-lfs and `git-lfs clone *repo*`**

1. Install NodeJS

2. cd to repo folder and execute

```
npm install express
npm install sqlite3
npm install path
npm install crypto
npm install cookie-parser
```

3. Run server with default port 5500 `node index.mjs`

(Run `npm install forever` and `forever index.mjs` to run unattended)

### **Important**

1. Html format text is supported in input boxes

2. Github Pages deployed but only serves static functions so you can only change texts but cannot add asset

### Current Dev Progress: 

1. Custom assets uploading (per user or shared?)

**Project Path**

- [x] Arranging Elements.. Basically Just a static website

- [x] Add sidebar on right side for data customization

- [x] Add clicking sfx

- [x] Customize UI pictures

- [x] Add load preset [from local db or custom config upload&download]

- [x] Auto remember preset by user cookie (or user account?)

 ->maybe auto crawl from tno wiki? - (use your browser, clipboard and mouse!!)

 ->maybe add more hoi4 mod ui? - (this is tno creator not kr kx md rf or anything else, **but interested if you can send PR**) (yes hittygubby just 2 lazy 2 search for mods on paradoxplaza or nexusmods(since i play pirated hoi4) and extract ui templates and do all tunings, and after all tno alt timelines just seems to be more popular)

- [x] Add button hover gfx (maybe not? we are not refactoring hoi4 anyways lmao)

- [x] Drag Resize desc width..?

- [x] Use database instead of discrete asset pics

- [ ] Add screenshot and save

- [x] Add superevent music(forget about it, just play music backgrounds!!1! this was for users to simply record screen but contradicts with screenshot function...(and you can just play random music in backgrounds!! and if you really cannot catch that timimg you can add later as sfx... so pretty lame and why im talking gibberish again now this is not diary ok i shut up))

- [x] Multilingual support (well technically only the "leader of " and "Economy" string is not editable so pretty lame...)

- [x] Add hover text menu(? maybe not since this is a showcase not refactoring hoi4!!1!)

- [x] Auto set top priority on window click

- [x] Translatable and componentized panel widgets for customization

I really HATE separating HTML with CSS, just bringing out so much inconvenience (especially for simple sites like this one)

... so if any of you guys want to refactor due to this, fork and dont send PR...

(technically i can just spam it to random free chatbot... but simply wait for main part to complete first..?)