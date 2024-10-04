window.onload = function(){
  
    //sync texts    
    document.getElementById("progressbar").style.width=Math.round(Math.random()*237)+"px";
    document.getElementById("leaderdesc").innerHTML = document.getElementById("leader").innerHTML;
    document.getElementById("countrydesc").innerHTML = document.getElementById("country").innerHTML;
    document.getElementById("descflag").src = document.getElementById("flagpic").src;
   
    //add attribs
    updateattrib(document.getElementById('poplist'), 'input', {'type': 'number','oninput': 'updatepop()','placeholder': 'Any Positive Number'});
    updateattrib(document.getElementById('basics'), 'input', {'class': 'input','oninput': 'update(this)'});
    updateattrib(document.getElementById('description'), 'input', {'class': 'input','oninput': 'update(this)'});
    updateattrib(document.body, 'button',{'onmouseover':'this.style.opacity = 0.7','onmouseleave':'this.style.opacity = 1'})

    //sync textboxes
    document.querySelectorAll('.input').forEach(input => {input.value = document.getElementById(input.id.replace("input","")).innerHTML;});

    //init input data
    document.getElementById("focusproginput").value = Math.round(Number(document.getElementById("progressbar").style.width.replace("px",""))/237*100);
    const values = [90, 0, 0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 2, 1.4, 0];
    const c = document.getElementById("poplist").children;
    for (let i=0; i<values.length; i++) {c[3*i+1].value=values[i];}
    updatepop();

    //init pic data
    document.querySelectorAll('.queryinput').forEach(input => {input.value = document.getElementById(input.id.replace("input","pic")).src.split(/[/ ]+/).pop().replace(/_/g," ").replace(".png","");});
      
    //enumerate assets and append to list
    enumfiles(['flag','portrait','focus','econ','econsub','faction','ideology','super','news','header']);
    
    document.getElementById('uploadJson').addEventListener('click', () => {document.getElementById('fileInput').click();});
    document.getElementById('fileInput').addEventListener('change', (event) => uploadjson(event));
    const d = new Date();
    const u = username==="" ? username : " - "+username;
    document.getElementById('filenameinput').value = `${d.toLocaleString("zh-CN")}${u}`
    if(document.cookie!=""){
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('username').style.display = 'none';
      document.getElementById('password').style.display = 'none';
      document.getElementById('loginunfoldButton').style.display = 'none';
      document.getElementById('loginButton').style.display = 'none';
      document.getElementById('logoutButton').style.display = 'inline-block';
      autoLogin()}
}
// main end

//user login section
var username = "";
async function autoLogin() {
  const response = await fetch('/auto-login', {method: 'GET',headers: {'Content-Type': 'application/json'},credentials: 'same-origin'});
  const data = await response.json();
  if (data.success) {
      username = data.user;
      loadPresets(data.user);
      const d = new Date();
      const u = username==="" ? username : " - "+username;
      document.getElementById('filenameinput').value = `${d.toLocaleString("zh-CN")}${u}`
      //if(data.ok)
        {if(confirm(`Load last saved preset "${data.name}" ?`)){jsonupdate(JSON.parse(data.data));}}} 
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
      loadPresets(user);
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('username').style.display = 'none';
      document.getElementById('password').style.display = 'none';
      document.getElementById('loginunfoldButton').style.display = 'none';
      document.getElementById('loginButton').style.display = 'none';
      document.getElementById('logoutButton').style.display = 'inline-block';
      const d = new Date();
      const u = username==="" ? username : " - "+username;
      document.getElementById('filenameinput').value = `${d.toLocaleString("zh-CN")}${u}`
    } else if (data.message === 'User not found') {
      if (confirm('User not found. Register?')) {
          const registerResponse = await fetch('/register', {
              method: 'POST',headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ user, pass })});
          const registerData = await registerResponse.json();
          if (registerData.success) {
              document.cookie = `session=${registerData.cookie}; path=/`;
              alert('Registered');
              username = user;
              loadPresets(user);
              document.getElementById('username').value = '';
              document.getElementById('password').value = '';
              document.getElementById('username').style.display = 'none';
              document.getElementById('password').style.display = 'none';
              document.getElementById('loginunfoldButton').style.display = 'none';
              document.getElementById('loginButton').style.display = 'none';
              document.getElementById('logoutButton').style.display = 'inline-block';
              const d = new Date();
              const u = username==="" ? username : " - "+username;
              document.getElementById('filenameinput').value = `${d.toLocaleString("zh-CN")}${u}`
          } else {alert('Registration failed!');}}} else {alert('Login failed!');}
}

function logout(){
  document.cookie = "session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    username = '';
    document.getElementById('presetList').innerHTML = '';
    document.getElementById('username').value = '';
  document.getElementById('password').value = '';
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('loginunfoldButton').style.display = 'inline-block';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('username').style.display = 'none';
document.getElementById('password').style.display = 'none';
const d = new Date();
const u = username==="" ? username : " - "+username;
document.getElementById('filenameinput').value = `${d.toLocaleString("zh-CN")}${u}`
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
                if (confirm("Sure to remove preset?")) {
                    fetch(`/presetsdel?${params.toString()}`, {method: 'GET',headers: {'id': preset.id}});
                    dropdown.removeChild(option);}});option.appendChild(del);});});
}
//user login section end
function screenshot(){
  capture(document.body,document.body.backgroundColor,
    Math.max(wid('main'),wid('econ'),wid('desc'),wid('newswindow'),wid('superwindow')),
    Math.max(hei('main'),hei('econ'),hei('desc'),hei('newswindow'),hei('superwindow')))
}
function screenshotpiechart(){
  capture(document.getElementById('piechart'),document.body.backgroundColor,60,60)
}


function capture(ele,bkg,width,height) {
    document.getElementById('screenshotprogress').innerHTML = 'Capturing Contents...'
    htmlToImage.toBlob(ele, {
      pixelRatio:Number(document.getElementById('screenshotscale').value),
      width:width,
      height:height,
      backgroundColor: bkg,
      filter: (node) => {return node.id !== 'sidebarbutton' && node.id !== 'sidebar';}
      //,quality: Number(document.getElementById('screenshotquality').value)
    }).then(async (blob) => {
        const compressedFile = await imageCompression(blob,{useWebWorker: true,alwaysKeepResolution:true,
        onProgress: (prog)=>{document.getElementById('screenshotprogress').innerHTML=`Image ${prog}% Compressed`;}});
      const a = document.createElement('a');
      const d = new Date();
      const u = username === "" ? username : " - " + username;
      a.download = `${d.toLocaleString("zh-CN")}${u}.png`;
      a.href = URL.createObjectURL(compressedFile);
      a.click();
      a.remove();
      document.getElementById('screenshotprogress').innerHTML = 'Done!'
    })
}

function wid(e){w=Number(window.getComputedStyle(document.getElementById(e)).left.replace("px",""))+Number(window.getComputedStyle(document.getElementById(e)).width.replace("px",""));if(isNaN(w)) return 0;else return w;}
function hei(e){h=Number(window.getComputedStyle(document.getElementById(e)).top.replace("px",""))+Number(window.getComputedStyle(document.getElementById(e)).height.replace("px",""));if(isNaN(h)) return 0;else return h;}


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
  fetch('/preset',{method:'POST',headers:{'Content-Type':'application/json','username':base64Encode(username),'method':'save','name':base64Encode(document.getElementById('filenameinput').value)},body:JSON.stringify(returnjson())}).then(response => {if (response.ok) {alert('Saved!');loadPresets(username)} else {alert('FAILED!!1!')}})}
  else alert('Cloud Saves requires you to log in.')
}

function returnjson(){
  const o = {
    basics: fetchdata('basics','input'),
    data: fetcharr(),
    focusprog: document.getElementById("focusproginput").value,
    picture: fetchpic('pictures','input'),
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
  for (const e in jsonData.picture){document.getElementById(e).value = jsonData.picture[e].replace(/_/g," ").replace(".png","");}
  for (const e in jsonData.picture)
   {document.getElementById(e.replace("input","pic")).src = `api/${e.replace("input","")}/${jsonData.picture[e]}`;}
  for (const e in jsonData.desc){document.getElementById(e).value = jsonData.desc[e];}
  for (const e in jsonData.desclong){document.getElementById(e).value = jsonData.desclong[e];}
  for (let i=0; i<13; i++){document.getElementById("poplist").children[3*i+1].value=jsonData.data[i];}
  for (const e in jsonData.pos){document.getElementById(e.replace("pos","")).style.left = jsonData.pos[e][0];}
  for (const e in jsonData.pos){document.getElementById(e.replace("pos","")).style.top = jsonData.pos[e][1];}
  for (const e in jsonData.size){document.getElementById(e.replace("size","")).style.width = jsonData.size[e][0];}
  for (const e in jsonData.size){document.getElementById(e.replace("size","")).style.height = jsonData.size[e][1];}
  for (const e in jsonData.pri){document.getElementById(e.replace("pri","")).style.zIndex = jsonData.pri[e];}
  document.getElementById("main").style.zIndex = highestZIndex+100;
  document.getElementById("sidebar").style.zIndex = highestZIndex+200;
  document.getElementById("sidebarbutton").style.zIndex = highestZIndex+300;
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
  updateprog(document.getElementById("focusproginput"));
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
  for (let i=0; i<13; i++) {values[i]=c[3*i+1].value;}
  return values;
}
function fetchpic(parent,tag) {
  const div = document.getElementById(parent);
  const inputs = div.getElementsByTagName(tag);
  const inputValues = {};
  for (let input of inputs) {inputValues[input.id] = `${input.value.replace(/ /g,"_")}.png`;}
  return inputValues;
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

function enumfiles(lists){
  lists.forEach(list => {
  document.getElementById(`${list}input`).addEventListener('input', function() {
  const query = this.value;
  if (!query) {document.getElementById(`autocomp${list}`).innerHTML = '';return;}
  fetch(`/api/${list}?q=${query}`)
      .then(response => response.json())
      .then(files => {
          const autocompleteList = document.getElementById(`autocomp${list}`);
          autocompleteList.innerHTML = '';
          files.forEach(file => {
              const item = document.createElement('div');
              item.textContent = file.name.replace(/_/g," ").replace(".png","");
              item.addEventListener('click', () => {
                  document.getElementById(`${list}input`).value = file.name.replace(/_/g," ").replace(".png","");
                  document.getElementById(`${list}pic`).src = `/api/${list}/${file.name}`;
                  autocompleteList.innerHTML = '';
                  document.getElementById("descflag").src=document.getElementById("flagpic").src;});
              item.style.borderBottom = '1px solid #333333';
              autocompleteList.appendChild(item);});})
      .catch(error => console.error('Error fetching files:', error));});
})}

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
    rgb(18, 184, 0) 0 ${scaledAngles[0]}deg,rgb(128, 0, 128) 0 ${scaledAngles[1]}deg,
    rgb(25, 25, 25) 0 ${scaledAngles[2]}deg,rgb(106, 35, 0) 0 ${scaledAngles[3]}deg,
    rgb(131, 70, 0) 0 ${scaledAngles[4]}deg,rgb(90, 90, 90) 0 ${scaledAngles[5]}deg,
    rgb(157, 157, 157) 0 ${scaledAngles[6]}deg,rgb(0, 0, 214) 0 ${scaledAngles[7]}deg,
    rgb(29, 157, 255) 0 ${scaledAngles[8]}deg,rgb(255, 0, 174) 0 ${scaledAngles[9]}deg,
    rgb(204, 0, 0) 0 ${scaledAngles[10]}deg,rgb(149, 0, 0) 0 ${scaledAngles[11]}deg)`;
}

function update(input){
  document.getElementById(input.id.replace("input","")).innerHTML = input.value;
  document.getElementById("leaderdesc").innerHTML = document.getElementById("leader").innerHTML;
  document.getElementById("countrydesc").innerHTML = document.getElementById("country").innerHTML;
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
    document.getElementById("sidebarbutton").innerHTML = "Hide Editor";
    document.getElementById("sfxopenwindow").play();}
  else{
    remsidebar = window.getComputedStyle(document.getElementById("sidebar")).width;
    document.getElementById("sidebar").style.right = "-"+remsidebar;
    document.getElementById("sidebarbutton").innerHTML = "Show Editor";
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

let lang="English"
function langchange(){
  document.getElementById("lang").innerHTML == "English" ? langchtocn() : langchtoen();
  document.getElementById("sfxcheck").play();
}
function langchtocn(){
    document.getElementById("lang").innerHTML = "中文";
    document.getElementById("leaderofen").style.display = "none";
    document.getElementById("leaderofcn").style.display = "";
    document.getElementById("economyen").style.display = "none";
    document.getElementById("economycn").style.display = "";
    lang="中文";}
function langchtoen(){
    document.getElementById("lang").innerHTML = "English";
    document.getElementById("leaderofen").style.display = "";
    document.getElementById("leaderofcn").style.display = "none";
    document.getElementById("economyen").style.display = "";
    document.getElementById("economycn").style.display = "none";
    lang="English";}

function updateprog(p){
  if (Number(p.value) >=0){
    if (Number(p.value) <=100){
      document.getElementById("progressbar").style.width=p.value*237/100+"px";}
    else document.getElementById("progressbar").style.width="237px"}
  else document.getElementById("progressbar").style.width="0px"
}