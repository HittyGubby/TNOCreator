window.onload = function(){

    genpiccontainer()
  
    //sync texts    
    document.getElementById("progressbar").style.width=Math.round(Math.random()*237)+"px";
    //document.getElementById("leaderdesc").innerHTML = document.getElementById("leader").innerHTML;
    //document.getElementById("countrydesc").innerHTML = document.getElementById("country").innerHTML;
    //document.getElementById("descflag").src = document.getElementById("flagpic").src;
    
   
    //add attribs
    updateattrib(document.getElementById('poplist'), 'input', {'min':'0','type': 'number','oninput': 'updatepop()','placeholder': '任意正数'});
    updateattrib(document.getElementById('basics'), 'input', {'class': 'input','oninput': 'update(this)'});
    updateattrib(document.getElementById('description'), 'input', {'class': 'input','oninput': 'update(this)'});
    updateattrib(document.body, 'button',{'onmouseover':'this.style.opacity = 0.7','onmouseleave':'this.style.opacity = 1'})

    //sync textboxes
    document.querySelectorAll('.input').forEach(input => {input.value = document.getElementById(input.id.replace("input","")).innerHTML;});

    //init input data
    document.getElementById("focusproginput").value = Math.round(Number(document.getElementById("progressbar").style.width.replace("px",""))/237*100);
    const values = [90, 0, 0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 0, 2, 1.4, 0];
    const c = document.getElementById("poplist").children;
    for (let i=0; i<values.length; i++) {c[3*i+1].value=values[i];}
    updatepop();

    //init pic data
    document.querySelectorAll('.queryinput').forEach(input => {input.value = document.getElementById(input.id.replace("input","pic")).src.replace(document.location.origin,'').replace('/preset/','')
      //.split(/[/ ]+/).pop().replace(/_/g," ").replace(".png","");
    });
    update(document.getElementById("detaildescinput"));

    document.getElementById('uploadJson').addEventListener('click', () => {document.getElementById('fileInput').click();});
    document.getElementById('fileInput').addEventListener('change', (event) => uploadjson(event));
    document.getElementById('filenameinput').value = `${new Date().toLocaleString("zh-CN")}${username==="" ? username : " - "+username}`
    if(document.cookie!=""){
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('username').style.display = 'none';
      document.getElementById('password').style.display = 'none';
      document.getElementById('loginunfoldButton').style.display = 'none';
      document.getElementById('loginButton').style.display = 'none';
      document.getElementById('logoutButton').style.display = 'inline-block';
      autoLogin()}
    username = sessionStorage.getItem('username');
}
// main end

//user login section
var username = "";
async function autoLogin() {
  const response = await fetch('/auto-login', {method: 'GET',headers: {'Content-Type': 'application/json'},credentials: 'same-origin'});
  const data = await response.json();
  if (data.success) {
      username = data.user;
      sessionStorage.setItem('username', username);
      document.querySelectorAll('.uploadbutton').forEach(b => {
        b.onclick=function(){uploadasset(this)};})
      loadPresets(data.user);
      document.getElementById('filenameinput').value = `${new Date().toLocaleString("zh-CN")}${username==="" ? username : " - "+username}`
      //if(data.ok)
      if(data.message!='No saved presets')
        {if(confirm(`加载上次保存的 "${data.name}" ?`)){jsonupdate(JSON.parse(data.data));}}
    } 
      else {console.log('Auto-login failed:', data.message);}
}

async function loginunfold(){
  document.getElementById('username').style.display = 'inline-block';
  document.getElementById('password').style.display = 'inline-block';
  document.getElementById('loginunfoldButton').style.display = 'none';
  document.getElementById('loginButton').style.display = 'inline-block';
}

async function login(){
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const response = await fetch('/login',{method:'POST',headers: {'Content-Type':'application/json'},body:JSON.stringify({user, pass})});
  const data = await response.json();
  if (data.success) {
      document.cookie = `session=${data.cookie}; path=/`;
      username = user;
      sessionStorage.setItem('username', username);
      loadPresets(user);
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('username').style.display = 'none';
      document.getElementById('password').style.display = 'none';
      document.getElementById('loginunfoldButton').style.display = 'none';
      document.getElementById('loginButton').style.display = 'none';
      document.getElementById('logoutButton').style.display = 'inline-block';
      document.querySelectorAll('.uploadbutton').forEach(b => {
        b.onclick=function(){uploadasset(this)};})
      document.getElementById('filenameinput').value = `${new Date().toLocaleString("zh-CN")}${username==="" ? username : " - "+username}`
    } else if (data.message === 'User not found') {
      if(user!=''){
      if (confirm('用户不存在。注册？')) {
          const registerResponse = await fetch('/register', {
              method: 'POST',headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ user, pass })});
          const registerData = await registerResponse.json();
          if (registerData.success) {
              document.cookie = `session=${registerData.cookie}; path=/`;
              alert('已注册');
              username = document.getElementById('username').value;
              //loadPresets(user);
              document.getElementById('username').value = '';
              document.getElementById('password').value = '';
              document.getElementById('username').style.display = 'none';
              document.getElementById('password').style.display = 'none';
              document.getElementById('loginunfoldButton').style.display = 'none';
              document.getElementById('loginButton').style.display = 'none';
              document.getElementById('logoutButton').style.display = 'inline-block';
              document.querySelectorAll('.uploadbutton').forEach(b => {
                b.onclick=function(){uploadasset(this)};})
              document.getElementById('filenameinput').value = `${new Date().toLocaleString("zh-CN")}${username==="" ? username : " - "+username}`
          } else {alert('注册失败');}}}} else {alert('登录失败');}
}

function logout(){
  document.cookie = "session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    username = '';
    sessionStorage.removeItem('username');
    document.getElementById('presetList').innerHTML = '';
    document.getElementById('username').value = '';
  document.getElementById('password').value = '';
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('loginunfoldButton').style.display = 'inline-block';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('username').style.display = 'none';
document.getElementById('password').style.display = 'none';
document.getElementById('filenameinput').value = `${new Date().toLocaleString("zh-CN")}${username==="" ? username : " - "+username}`
document.querySelectorAll('.uploadbutton').forEach(b => {
  b.onclick=function(){alert('登录后才可以上传！')};})
}

function base64Encode(str) {return btoa(unescape(encodeURIComponent(str)));}
function jsonupload(jsonData,method){
  fetch('/preset',{method:'POST',headers:{'Content-Type':'application/json','username':base64Encode(username),'method':method,'name':base64Encode(document.getElementById('filenameinput').value)},body:jsonData})}

function loadPresets(user) {
    const params = new URLSearchParams({username: encodeURIComponent(user)});
    fetch(`/presets?${params.toString()}`,{method:'GET',headers:{'Content-Type':'application/json'}})
    .then(response => response.json())
    .then(presets => {
        presets.sort((a, b) => b.id - a.id);
        const dropdown = document.getElementById('presetList');
        dropdown.innerHTML = '';
        presets.forEach(preset => {
            const option = document.createElement('div');
            option.textContent = preset.name;
            option.style.borderBottom = '1px solid #333333';
            option.className = 'preset-entry';
            option.addEventListener('click', () => {
                document.getElementById('filenameinput').value = preset.name;
                jsonupdate(JSON.parse(preset.data));});
            dropdown.appendChild(option);
            const del = document.createElement('button');
            del.style = "transition: 0.3s; background: url('template/closebutton_small.png') no-repeat; border: none; width: 26px; height: 26px; float: right;";
            del.addEventListener('click', (event) => {
                event.stopPropagation();
                if (confirm("确认移除预设？")) {
                    fetch(`/presetsdel?${params.toString()}`, {method: 'GET',headers: {'id': preset.id}});
                    dropdown.removeChild(option);}});option.appendChild(del);});});
}
//user login section end
function screenshot(){
  capture(document.body,document.body.backgroundColor,
    Math.max(wid('main'),wid('econ'),wid('desc'),wid('newswindow'),wid('superwindow')),
    Math.max(hei('main'),hei('econ'),hei('desc'),hei('newswindow'),hei('superwindow')))}
function screenshotpiechart(){
  capture(document.getElementById('piechart'),'#00000000',100,100)}

  /*
function capture(ele,bkg,width,height) {
    document.getElementById('screenshotprogress').innerHTML = '正在捕捉窗口内容'
    htmlToImage.toBlob(ele, {
      pixelRatio:Number(document.getElementById('screenshotscale').value),
      width:width,
      height:height,
      backgroundColor: bkg,
      fontEmbedCSS: true,
      filter: (node) => {return node.id !== 'sidebarbutton' && node.id !== 'sidebar';}
      //,quality: Number(document.getElementById('screenshotquality').value)
    }).then(async (blob) => {
        const compressedFile = await imageCompression(blob,{useWebWorker: true,alwaysKeepResolution:true,
        onProgress: (prog)=>{document.getElementById('screenshotprogress').innerHTML=`图片已压缩${prog}%`;}});
      const a = document.createElement('a');
      a.download = `${new Date().toLocaleString("zh-CN")}${username==="" ? username : " - "+username}`;
      a.href = URL.createObjectURL(compressedFile);
      a.click();
      a.remove();
      document.getElementById('screenshotprogress').innerHTML = '完成！'
    })
}*/ //with compression codes

async function capture(ele, bkg, width, height) {
  const svgData = await htmlToImage.toSvg(ele, {
    width: width,
    height: height,
    backgroundColor: bkg,
    filter: (node) => {return node.id !== 'sidebarbutton' && node.id !== 'sidebar';}});
  const svgContent = svgData.replace(/^data:image\/svg\+xml;charset=utf-8,/, '');
  const decodedSvg = decodeURIComponent(svgContent);
  const svgBlob = new Blob([decodedSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const a = document.createElement('a');
  a.download = `${new Date().toLocaleString("zh-CN")}${username === "" ? username : " - " + username}.svg`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

function wid(e){w=Number(window.getComputedStyle(document.getElementById(e)).left.replace("px",""))+
  Number(window.getComputedStyle(document.getElementById(e)).width.replace("px",""));if(isNaN(w)) return 0;else return w;}
function hei(e){h=Number(window.getComputedStyle(document.getElementById(e)).top.replace("px",""))+
  Number(window.getComputedStyle(document.getElementById(e)).height.replace("px",""));if(isNaN(h)) return 0;else return h;}


function uploadjson(event){
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const jsonData = JSON.parse(e.target.result);
          jsonupdate(jsonData);
          jsonupload(JSON.stringify(returnjson()),'upload');};
          reader.readAsText(file);}}

function downloadjson(){
  const divData = returnjson();
  const jsonData = JSON.stringify(divData);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${document.getElementById('filenameinput').value}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  jsonupload(JSON.stringify(returnjson()),'download');
}

function savejson(){
  if(username != ""){
  //jsonupload(JSON.stringify(returnjson()),'save');
  fetch('/preset',{method:'POST',headers:{'Content-Type':'application/json','username':base64Encode(username),'method':'save','name':base64Encode(document.getElementById('filenameinput').value)},body:JSON.stringify(returnjson())}).then(response => {if (response.ok) {alert('Saved!');loadPresets(username)} else {alert('失败！')}})}
  else alert('登录之后才能保存云预设！')
}

function returnjson(){
  const o = {
    basics: fetchdata('basics','input'),
    data: fetcharr(),
    focusprog: document.getElementById("focusproginput").value,
    picture: fetchpic('pictures','queryinput',true),
    pictureuser: fetchpic('pictures','queryuserinput',false),
    picturepath: fetchpicpath(),
    desc: fetchdata('description','input'),
    desclong: fetchdata('description','textarea'),
    pos: {
      econpos: fetchpos('econ'),
      descpos: fetchpos('desc'),
      newswindowpos: fetchpos('newswindow'),
      superwindowpos: fetchpos('superwindow')
    },
    size: {
      descsize: fetchsize('desc')
    },
    pri: {
      econpri: fetchpri('econ'),
      descpri: fetchpri('desc'),
      newswindowpri: fetchpri('newswindow'),
      superwindowpri: fetchpri('superwindow')
    },
    show: {
      desc: fetchifcheck('checkboxdesc'),
      econ: fetchifcheck('checkboxecon'),
      newswindow: fetchifcheck('checkboxnewswindow'),
      superwindow: fetchifcheck('checkboxsuperwindow'),
    },
    lang: lang,
    background: document.body.style.backgroundColor
  }
  return o;
}

function jsonupdate(jsonData){
  for (const e in jsonData.basics){document.getElementById(e).value = jsonData.basics[e];}
  document.getElementById("focusproginput").value=jsonData.focusprog;
  for (const e in jsonData.picture){document.getElementById(e).value = jsonData.picture[e];}
  for (const e in jsonData.pictureuser){document.getElementById(e).value = jsonData.pictureuser[e];}
  for (const e in jsonData.picturepath)
   {document.getElementById(e).src = jsonData.picturepath[e]}
  for (const e in jsonData.desc){document.getElementById(e).value = jsonData.desc[e];}
  for (const e in jsonData.desclong){document.getElementById(e).value = jsonData.desclong[e];}
  for (let i=0; i<14; i++){document.getElementById("poplist").children[3*i+1].value=jsonData.data[i];}
  for (const e in jsonData.pos){document.getElementById(e.replace("pos","")).style.left = jsonData.pos[e][0];}
  for (const e in jsonData.pos){document.getElementById(e.replace("pos","")).style.top = jsonData.pos[e][1];}
  for (const e in jsonData.size){document.getElementById(e.replace("size","")).style.width = jsonData.size[e][0];}
  for (const e in jsonData.size){document.getElementById(e.replace("size","")).style.height = jsonData.size[e][1];}
  for (const e in jsonData.pri){document.getElementById(e.replace("pri","")).style.zIndex = jsonData.pri[e];}
  document.getElementById("main").style.zIndex = highestZIndex+100;
  document.getElementById("sidebar").style.zIndex = highestZIndex+300;
  document.getElementById("sidebarbutton").style.zIndex = highestZIndex+500;
  document.body.style.backgroundColor = jsonData.background;
  document.getElementById('backgroundinput').value = jsonData.background
  for (const e in jsonData.show){
   if (jsonData.show[e]){document.getElementById(e).style.display = "";
     document.getElementById(`checkbox${e}`).style.background = "url('template/generic_checkbox_checked.png') no-repeat";}
   else {document.getElementById(e).style.display="none";
     document.getElementById(`checkbox${e}`).style.background = "url('template/generic_checkbox_unchecked.png') no-repeat";}}
 document.getElementById("lang").innerHTML = jsonData.lang;
 if (jsonData.lang == "中文") langchtocn();
 else langchtoen();
  updatepop();
  updatetrig('basics', 'input');
  updatetrig('description', 'input');
  updatetrig('description', 'textarea');
  document.getElementById('progressbar').style.width=`${jsonData.focusprog * 237 / 100}px`
  document.getElementById("descflag").src=document.getElementById("flagpic").src;
}

function parsepos(json){for (const e in json.pos){document.getElementById(e.replace("pos","")).left = jsonData.pos.e[0];}}

function fetchdata(parent,tag) {
  const div = document.getElementById(parent);
  const inputs = div.getElementsByTagName(tag);
  const inputValues = {};
  for (let input of inputs) {inputValues[input.id] = input.value;}
  return inputValues;
}
function fetcharr(){
  const c = document.getElementById("poplist").children;
  const values = {};
  for (let i=0; i<14; i++) {values[i]=c[3*i+1].value;}
  return values;
}
function fetchpic(parent,tag,deform) {
  const div = document.getElementById(parent);
  const inputs = div.getElementsByClassName(tag);
  const inputValues = {};
  if(deform){
  //for (let input of inputs) {inputValues[input.id] = `${input.value.replace(/ /g,"_")}.png`;}}
  for (let input of inputs) {inputValues[input.id] = input.value;}}
  else for (let input of inputs) {inputValues[input.id] = input.value;}
  return inputValues;
}
function fetchpicpath(){
  const col = document.getElementsByClassName('pic');
  const values={};
  for(let sub of col){
    values[sub.id] = sub.src.replace(document.location.href,'')}
    return values;
}
function fetchpos(div){
  const divpos = {};
  const d = document.getElementById(div);
  divpos[0]=window.getComputedStyle(d).left;
  divpos[1]=window.getComputedStyle(d).top;
  return divpos;
}
function fetchpri(div){
  return window.getComputedStyle(document.getElementById(div)).zIndex;
}
function fetchsize(div){
  const divpos = {};
  const d = document.getElementById(div);
  divpos[0]=window.getComputedStyle(d).width;
  divpos[1]=window.getComputedStyle(d).height;
  return divpos;
}
function fetchifcheck(div){
  const d = document.getElementById(div);
  if(d.style.background == "url(\"template/generic_checkbox_checked.png\") no-repeat"){return true;}else return false;
}

function updateattrib(parent,child,attribs){
  const c = parent.getElementsByTagName(child);
  for (let i = 0; i < c.length; i++) {for (let key in attribs) {c[i].setAttribute(key, attribs[key]);}}
}

function updatetrig(parent,child){
  const c = document.getElementById(parent).getElementsByTagName(child);
  for (let i = 0; i < c.length; i++) {update(c[i]);}
}

function updatepop() {
  let a = Array.from(document.getElementById("poplist").children).map(child => Number(child.value));
  let angles = [];
  for (let i = 4; i < a.length; i += 3) {angles.push(a[i]);}
  let cumulativeAngles = angles.reduce((acc, angle, index) => {
    acc.push((acc[index - 1] || 0) + angle);return acc;}, []);
    let total = cumulativeAngles[cumulativeAngles.length - 1];
    let scaleFactor = 360 / total;
    let scaledAngles = cumulativeAngles.map(angle => angle * scaleFactor);
    document.getElementById("piechart").style.background = `conic-gradient(
    from ${a[1]}deg, 
      rgb(18, 184, 0) 0 ${scaledAngles[0]}deg,rgb(52, 25, 80) 0 ${scaledAngles[1]}deg,
      rgb(35, 35, 35) 0 ${scaledAngles[2]}deg,rgb(80, 50, 0) 0 ${scaledAngles[3]}deg,
      rgb(132, 50, 0) 0 ${scaledAngles[4]}deg,rgb(75, 75, 75) 0 ${scaledAngles[5]}deg,
      rgb(130, 130, 130) 0 ${scaledAngles[6]}deg,rgb(0, 0, 135) 0 ${scaledAngles[7]}deg,
      rgb(39, 49, 149) 0 ${scaledAngles[8]}deg,
      rgb(78, 97, 163) 0 ${scaledAngles[9]}deg,rgb(169, 27, 79) 0 ${scaledAngles[10]}deg,
      rgb(155, 0, 0) 0 ${scaledAngles[11]}deg,rgb(110, 0, 0) 0 ${scaledAngles[12]}deg)`;
}

function update(input) {
  document.getElementById(input.id.replace("input", "")).innerHTML = input.value
      .replace(/{leader}/g, `<span class="leaderdesc" style="color:#cccc00"></span>`)
      .replace(/{country}/g, `<span class="countrydesc" style="color:#cccc00"></span>`)
      .replace(/{flag}/g, `<div style="margin: 0px 0px 0px 9px; position:absolute; z-index: 3; display: inline; justify-content: center; align-items: center; height: 13px; width: 20px;"><img class="descflag" style="left: 0px; margin: 0 -10px; height: inherit; width: inherit;"></div>`);

  requestAnimationFrame(() => {
      let flagSrc = document.getElementById("flagpic").src;
      document.querySelectorAll(".descflag").forEach(flag => {
          flag.src = flagSrc;
      });

      let leaderText = document.getElementById("leader").innerHTML;
      document.querySelectorAll(".leaderdesc").forEach(desc => {
          desc.innerHTML = leaderText;
      });

      let countryText = document.getElementById("country").innerHTML;
      document.querySelectorAll(".countrydesc").forEach(desc => {
          desc.innerHTML = countryText;
      });
  });
}


let highestZIndex = 10;
function dragElement(elmnt) {
  document.getElementById("sidebarbutton").style.zIndex = highestZIndex+300;
  document.getElementById("sidebar").style.zIndex = highestZIndex+200;
  document.getElementById("main").style.zIndex = highestZIndex+100;
  elmnt.style.zIndex = ++highestZIndex;
}

let remsidebar = "11px";
function sidebartoggle(){
  if (document.getElementById("sidebar").style.right == "-"+remsidebar){
    document.getElementById("sidebar").style.right = "0px";
    document.getElementById("sidebarbutton").innerHTML = "隐藏侧栏";
    document.getElementById("sfxopenwindow").play();}
  else{
    remsidebar = window.getComputedStyle(document.getElementById("sidebar")).width;
    document.getElementById("sidebar").style.right = "-"+remsidebar;
    document.getElementById("sidebarbutton").innerHTML = "显示侧栏";
    document.getElementById("sfxclosewindow").play();}
}

function check(c){
  if (c.style.background == "url(\"template/generic_checkbox_checked.png\") no-repeat"){
    c.style.background = "url('template/generic_checkbox_unchecked.png') no-repeat";
    document.getElementById(c.id.replace("checkbox","")).style.display = "none";
    document.getElementById("sfxcheck").play();
  }
  else{
    c.style.background = "url(\"template/generic_checkbox_checked.png\") no-repeat";
    document.getElementById(c.id.replace("checkbox","")).style.display = "";
    document.getElementById("sfxcheck").play();
  } 
}

let lang="中文"
function langchange(){
  document.getElementById("lang").innerHTML == "English" ? langchtocn() : langchtoen();
  document.getElementById("sfxcheck").play();
}
function langchtocn(){
    document.getElementById("lang").innerHTML = "中文";
    //document.getElementById("leaderofen").style.display = "none";
    //document.getElementById("leaderofcn").style.display = "";
    document.getElementById("economyen").style.display = "none";
    document.getElementById("economycn").style.display = "";
    lang="中文";}
function langchtoen(){
    document.getElementById("lang").innerHTML = "English";
    //document.getElementById("leaderofen").style.display = "";
    //document.getElementById("leaderofcn").style.display = "none";
    document.getElementById("economyen").style.display = "";
    document.getElementById("economycn").style.display = "none";
    lang="English";}

var shared=false;
var queryshared=false;
function checkshare(){
  c=document.getElementById('checkboxshared')
    if (shared){
      c.style.background = "url('template/generic_checkbox_unchecked.png') no-repeat";
      shared=false;
      document.getElementById("sfxcheck").play();}
    else{
      c.style.background = "url(\"template/generic_checkbox_checked.png\") no-repeat";
      shared=true;
      document.getElementById("sfxcheck").play();} 
}
function checkqueryshare(){
  c=document.getElementById('checkboxqueryshared')
    if (queryshared){
      c.style.background = "url('template/generic_checkbox_unchecked.png') no-repeat";
      queryshared=false;
      document.getElementById("sfxcheck").play();}
    else{
      c.style.background = "url(\"template/generic_checkbox_checked.png\") no-repeat";
      queryshared=true;
      document.getElementById("sfxcheck").play();} 
}

function genpiccontainer(){
  const elements = ['flag', 'portrait', 'ideology', 'faction', 'focus', 'econ', 'econsub', 'super', 'news', 'header'];
  elements.forEach(id => {
    const div = document.createElement('div');
    div.id = id;

    const span = document.createElement('span');
    span.className = 'spancn';
    div.appendChild(span);

    const input = document.createElement('input');
    input.className = 'queryinput';
    input.id = `${id}input`;
    //input.placeholder = `Search for ${id.charAt(0).toUpperCase() + id.slice(1)}...`;
    input.style.fontFamily = 'Aldrich, FZRui';
    input.addEventListener('input', function() {
      const list=this.id.replace('input','');
      const query = this.value;
      if (!query) {document.getElementById(`autocomp${list}`).innerHTML = '';return;}
      fetch(`/api/${list}?q=${query}`)
          .then(response => response.json())
          .then(files => {
              const autocompleteList = document.getElementById(`autocomp${list}`);
              autocompleteList.innerHTML = '';
              files.forEach(file => {
                  const item = document.createElement('div');
                  item.textContent = file.name
                  //.replace(/_/g," ").replace(".png","");
                  item.addEventListener('click', () => {
                      document.getElementById(`${list}input`).value = file.name
                      //.replace(/_/g," ").replace(".png","");
                      document.getElementById(`${list}pic`).src = `/api/${list}/${file.name}`;
                      autocompleteList.innerHTML = '';
                      //document.getElementById("descflag").src=document.getElementById("flagpic").src;
                      let flagSrc = document.getElementById("flagpic").src;
                      document.querySelectorAll(".descflag").forEach(flag => {
                          flag.src = flagSrc;
                      });
                    });
                  item.style.borderBottom = '1px solid #333333';
                  autocompleteList.appendChild(item);});})
          .catch(error => console.error('Error fetching files:', error));});
    div.appendChild(input);

    const autocomp = document.createElement('div');
    autocomp.className = 'autocomp';
    autocomp.id = `autocomp${id}`;
    autocomp.style.maxWidth = '100%';
    div.appendChild(autocomp);

    const upload = document.createElement('button');
    //upload.onclick=function() { uploadasset(this); };
    upload.className = 'uploadbutton'
    upload.id = `upload${id}`;
    upload.innerHTML=`上传`;
    upload.onclick=function(){alert('先登录才能上传！')}
    div.appendChild(upload);

    const userinput = document.createElement('input');
    userinput.className = 'queryuserinput';
    userinput.id = `${id}userinput`;
    //userinput.placeholder = `Search for custom ${id.charAt(0).toUpperCase() + id.slice(1)}...`;
    userinput.addEventListener('input', function() {
      const list=this.id.replace('userinput','');
      const query = this.value;
      if (!query) {document.getElementById(`autocompuser${list}`).innerHTML = '';return;}
      fetch(`/api/user/${list}?q=${query}`,{headers:{'Content-Type':'multipart/form-data','charset':'UTF-8','queryshared':queryshared}})
          .then(response => response.json())
          .then(files => {
              const autocompleteList = document.getElementById(`autocompuser${list}`);
              autocompleteList.innerHTML = '';
              files.forEach(file => {
                  const item = document.createElement('div');
                  item.textContent = file.filename;
                  item.style.maxWidth='400px'
                  item.style.overflowWrap='break-word';
                  item.addEventListener('click', () => {
                      document.getElementById(`${list}userinput`).value = file.filename;
                      document.getElementById(`${list}pic`).src = `/api/user/${list}/${file.filename}`;
                      autocompleteList.innerHTML = '';
                      //document.getElementById("descflag").src=document.getElementById("flagpic").src;
                      let flagSrc = document.getElementById("flagpic").src;
                      document.querySelectorAll(".descflag").forEach(flag => {
                          flag.src = flagSrc;});
                    });
                  item.style.borderBottom = '1px solid #333333';
                  if(file.user==username){
                  const del = document.createElement('button');
            del.style = "transition: 0.3s; background: url('template/closebutton_small.png') no-repeat; border: none; width: 26px; height: 26px; float: right;";
            del.addEventListener('click', (event) => {
              event.stopPropagation();
              if (confirm("确认移除图片？")) {
                fetch(`/assetdel`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'},
                  body: JSON.stringify({filename: file.filename,type: list})})
                .then(response => response.json())
                .then(result => {
                  if (result.success) {autocompleteList.removeChild(item);} else 
                  {console.error('Error:', result.message);}})
                .catch(error => {console.error('Error:', error);});}});
                    item.appendChild(del);}autocompleteList.appendChild(item);});})
          .catch(error => console.error('Error fetching files:', error));});
    div.appendChild(userinput);

    const uploader=document.createElement('input');
    uploader.type = 'file';
    uploader.id = `${id}uploader`;
    uploader.style.display='none';
    uploader.multiple=true;
    div.appendChild(uploader);

    const autocompuser = document.createElement('div');
    autocompuser.className = 'autocompuser';
    autocompuser.id = `autocompuser${id}`;
    autocompuser.style.maxWidth = '100%';
    div.appendChild(autocompuser);

    document.getElementById('piccontainer').appendChild(div);
  });
  const col = document.getElementsByClassName('queryuserinput')
  const ph=['任意分辨率','长宽比 3:4','大约 68x68','大约 75x75','大约 100x80','大约 60x60','大约 50x50','590x404','162x420','480x70']
  for(let i=0;i<=9;i++){col[i].placeholder = ph[i]}
  const spancn = document.getElementsByClassName('spancn')
  const spancne=['国旗：','领导人：','意识形态：','阵营：','国策：','经济：','亚经济','超事件：','新闻：','新闻页眉：']
  for(let i=0;i<=9;i++){spancn[i].innerHTML = spancne[i]}
  const querycn = document.getElementsByClassName('queryinput')
  const querycne=['搜索国旗：','搜索领导人：','搜索意识形态：','搜索阵营：','搜索国策：','搜索经济：','搜索亚经济','搜索超事件：','搜索新闻：','搜索新闻页眉：']
  for(let i=0;i<=9;i++){querycn[i].placeholder = querycne[i]}
}

function uploadasset(ele) {
  const type = ele.id.replace("upload", "");
  const fileInput = document.getElementById(`${type}uploader`);
  fileInput.click();
  fileInput.onchange = function () {
    const files = fileInput.files;
    const formData = new FormData();
    formData.append('username', base64Encode(username));
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]); 
    }
    document.getElementById(`${type}userinput`).value = files[0].name;

    
    fetch('/upload', {
      method: 'POST',
      headers: { 'type': type, 'shared': shared },
      body: formData
    })
    .then(response => response.json())
    .then(result => { console.log(result); document.getElementById(`${type}pic`).src = `/api/user/${type}/${files[0].name}`;
      document.getElementById("descflag").src = document.getElementById("flagpic").src;
    })
    .catch(error => { console.error('Error:', error); });
    
  };
}
