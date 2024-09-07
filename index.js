window.onload = function(){
  
    //sync texts    
    document.getElementById("progressbar").style.width=Math.round(Math.random()*237)+"px";
    document.getElementById("leaderdesc").innerHTML = document.getElementById("leader").innerHTML;
    document.getElementById("countrydesc").innerHTML = document.getElementById("country").innerHTML;
    document.getElementById("descflag").src = document.getElementById("flagpic").src;
   
    //add attribs
    updateattrib('poplist', 'input', {'type': 'number','oninput': 'updatepop()','placeholder': 'Any Positive Number'});
    updateattrib('basics', 'input', {'class': 'input','oninput': 'update(this)'});
    updateattrib('description', 'input', {'class': 'input','oninput': 'update(this)'});

    //sync textboxes
    document.querySelectorAll('.input').forEach(input => {input.value = document.getElementById(input.id.replace("input","")).innerHTML;});

    //init input data
    document.getElementById("focusproginput").value = Math.round(Number(document.getElementById("progressbar").style.width.replace("px",""))/237*100);
    const values = [90, 0, 0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 2, 1.4, 0];
    const c = document.getElementById("poplist").children;
    for (let i=0; i<values.length; i++) {c[3*i+1].value=values[i];}
    updatepop();

    //init pic data
    document.getElementById("flaginput").value = "GER"
    document.getElementById("portraitinput").value = "Portrait GER Reichstag Emergency Council"
    document.getElementById("focusinput").value = "goal unknown"
    document.getElementById("econinput").value = "EHP GER"
    document.getElementById("econsubinput").value = "Gelenkte Wirtschaft"
    document.getElementById("factioninput").value = "Leader-Einheitspakt"
    document.getElementById("ideologyinput").value = "national socialism group"
    document.getElementById("headerinput").value = "nazist-Germany"
    document.getElementById("newsinput").value = "GER german civil war"
    document.getElementById("superinput").value = "german civil war"
      
    //enumerate assets and append to list
    enumfiles('flag');
    enumfiles('portrait');
    enumfiles('focus');
    enumfiles('econ');
    enumfiles('econsub');
    enumfiles('faction');
    enumfiles('ideology');
    enumfiles('super');
    enumfiles('news');
    enumfiles('header');
    
  document.getElementById('downloadJson').addEventListener('click', () => {
  const divData = 
  {
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
    lang: lang
  }
  
  const jsonData = JSON.stringify(divData);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  fetch('/preset', {method: 'POST',headers: {'Content-Type': 'application/json'},body: jsonData})
  .then(response => {if (response.ok) {console.log('Data stored successfully');} 
  else {console.error('Error storing data');}});});

document.getElementById('uploadJson').addEventListener('click', () => {document.getElementById('fileInput').click();});
document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const jsonData = JSON.parse(e.target.result);

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
           document.getElementById("main").style.zIndex = highestZIndex+10000;
           document.getElementById("sidebar").style.zIndex = highestZIndex+20000;
           document.getElementById("sidebarbutton").style.zIndex = highestZIndex+30000;
           for (const e in jsonData.show){
            if (jsonData.show[e]){document.getElementById(e).style.display = "";
              document.getElementById(`checkbox${e}`).style.background = "url('template/generic_checkbox_checked.png') no-repeat";
            }
            else {
              document.getElementById(e).style.display="none";
              document.getElementById(`checkbox${e}`).style.background = "url('template/generic_checkbox_unchecked.png') no-repeat";}
          }
          document.getElementById("lang").innerHTML = jsonData.lang;
          if (jsonData.lang == "中文") langchtocn();
          else langchtoen();

           updatepop();
           updatetrig('basics', 'input');
           updatetrig('description', 'input');
           updatetrig('description', 'textarea');
           updateprog(document.getElementById("focusproginput"));
           document.getElementById("descflag").src=document.getElementById("flagpic").src;


          // Send the data to the server to update the database
          fetch('/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(jsonData)})
              .then(response => {if (response.ok) {console.log('Data uploaded successfully');} 
              else {console.error('Error uploading data');}});};reader.readAsText(file);}});

}
function parsepos(json){
  for (const e in json.pos){document.getElementById(e.replace("pos","")).left = jsonData.pos.e[0];}
}

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
  if(d.style.background == "url(\"template/generic_checkbox_checked.png\") no-repeat"){
    return true;
  }
  else return false;
}


function enumfiles(list){
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
              autocompleteList.appendChild(item);});})
      .catch(error => console.error('Error fetching files:', error));});
}

function updateattrib(parent,child,attribs){
  const c = document.getElementById(parent).getElementsByTagName(child);
  for (let i = 0; i < c.length; i++) {
    for (let key in attribs) {c[i].setAttribute(key, attribs[key]);}
  }
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
  elmnt.style.zIndex = ++highestZIndex;
  document.getElementById("main").style.zIndex = highestZIndex+10000;
  document.getElementById("sidebar").style.zIndex = highestZIndex+20000;
  document.getElementById("sidebarbutton").style.zIndex = highestZIndex+30000;
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
  if (document.getElementById("lang").innerHTML == "English") langchtocn();
  else langchtoen();
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