## TNOCreator
啥被高中牲写的TNO自定义事件生成器

基于vanilla javascript，服务端使用NodeJS，数据库基于sqlite3

### 安装

（为什么真的会有人装这个啊，数据库500M诶，LFS都要爆了）

0. git clone 仓库 **用了LFS存图片，所以你得先装 `git-lfs` 然后 `git-lfs clone *repo*`**

1. 安装 NodeJS

2. npm 安装依赖

```
npm install express
npm install sqlite3
npm install path
npm install crypto
npm install cookie-parser
npm install multer
```

3. `node index.mjs` 运行服务器，**默认端口 5500**

（无人值守运行请执行 `npm install forever` 和 `forever index.mjs`）

### **注意了...**

0. 理论上这个项目已经做完了但是后续可能会交给GPT优化（

1. 输入框里是支持html格式（如颜色，字体等）的哦（好吧其实本来就支持。。。）

2. 部署了github pages但是是静态的所以只能改文字，用不了（

3. 暂不支持用户删除（好吧不想做）

4. 截图功能搞不起来本地svg转png，这个就自己搞吧（不过svg会很大（默认7mb）因为要包括未压缩的字体图片素材等等）

   顺便svg自定义更方便？


## TNOCreator
TNO customizable showcase generator by a web noob

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
npm install multer
npm install fs
```

3. Run server with default port 5500 `node index.mjs`

(Run `npm install forever` and `forever index.mjs` to run unattended)

### **Important**

0. Technically this project has been completed, but maybe debloating in future using random chatbot...

1. Html format text is supported in input boxes

2. Github Pages deployed but only serves static functions so you can only change texts but cannot add asset

3. User account deletion is unsupported

4. Screenshot with svg format only, since converting svg to png with html-to-image got font problems

   but svgs got larger size(~7mb by default), so for actual production use a random svg to png converter plz (ffmpeg cant do)

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

- [x] Add screenshot and save

- [x] Add superevent music(forget about it, just play music backgrounds!!1! this was for users to simply record screen but contradicts with screenshot function...(and you can just play random music in backgrounds!! and if you really cannot catch that timimg you can add later as sfx... so pretty lame and why im talking gibberish again now this is not diary ok i shut up))

- [x] Multilingual support (well technically only the "leader of " and "Economy" string is not editable so pretty lame...)

- [x] Add hover text menu(? maybe not since this is a showcase not refactoring hoi4!!1!)

- [x] Auto set top priority on window click

- [x] Translatable and componentized panel widgets for customization

### Credits:

`jQuery` for UI and window composition

`html-to-image` for converting webpage into screenshot

[Deprecated] `browser-image-compression` for compressing screenshot(63% compression ratio on average)