### TNOCreator
*PLANNED TNO customized showcase generator..? By a total frontend noob(

##### Installation (Im not sure if anyone would really deploy this)
0.Clone Repo **used git lfs for database files, so you need to install git-lfs and `git-lfs clone *repo*`**

1. Install NodeJS

2. cd to repo folder and execute

```
npm install express
npm install cors
npm install sqlite3
npm install path
```

3. Run server with default port 5500

`node index.mjs`


**Important** Html format text is supported in input boxes


Current Dev Progress: **Adding Components**

- [ ] Arranging Elements.. Basically Just a static website

- [x] Add sidebar on right side for data customization

- [x] Add clicking sfx

- [x] Customize UI pictures

- [ ] Add load preset [from local db or custom config upload&download]

 ->maybe auto crawl from tno wiki?

 ->maybe add more hoi4 mod ui? 

- [x] Add button hover gfx (maybe not? we are not refactoring hoi4 anyways lmao)

- [x] Drag Resize desc width..?

- [x] Use database instead of discrete asset pics

- [ ] Add screenshot and save

- [ ] Add superevent music

- [ ] Multilingual support (well technically only the "leader of " and "Economy" string is not editable so pretty lame...)

- [x] Add hover text menu(? maybe not since this is a showcase not refactoring hoi4!!1!)

- [x] Auto set top priority on window click

- [x] Translatable and componentized panel widgets for customization

I really HATE separating HTML with CSS, just bringing out so much inconvenience (especially for simple sites like this one)

... so if any of you guys want to refactor due to this, fork and dont send PR...

(technically i can just spam it to random free chatbot... but simply wait for main part to complete first..?)