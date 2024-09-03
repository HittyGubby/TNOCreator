var server = 'http://127.0.0.1:5000';

window.onload = function(){
  
    //sync texts    
    document.getElementById("progressbar").style.width=Math.round(Math.random()*237)+"px";
    document.getElementById("leaderdesc").innerHTML = document.getElementById("leader").innerHTML;
    document.getElementById("countrydesc").innerHTML = document.getElementById("country").innerHTML;
    document.getElementById("descflag").src = document.getElementById("flagpic").src;
   
    //add attribs
    updateattrib('poplist', 'input', {'oninput': 'updatepop()','placeholder': 'Any Positive Number'});
    updateattrib('basics', 'input', {'class': 'input','oninput': 'update(this)'});

    //sync textboxes
    document.querySelectorAll('.input').forEach(input => {input.value = document.getElementById(input.id.replace("input","")).innerHTML;});

    //init popularity data
    const values = [90, 0, 0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 2, 1.4, 0];
    const c = document.getElementById("poplist").children;
    for (let i=0; i<values.length; i++) {c[3*i+1].value=values[i];}
    updatepop();

    //init pic data
    document.getElementById("flaginput").value = "GER"
    document.getElementById("portraitinput").value = "Portrait Germany Reichstag Emergency Council"
    document.getElementById("focusinput").value = "goal unknown"
      
    //enumerate assets and append to list
    enumfiles('flag');
    enumfiles('portrait');
    enumfiles('focus');
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
                  autocompleteList.innerHTML = '';});
              autocompleteList.appendChild(item);});})
      .catch(error => console.error('Error fetching files:', error));});
}

function updateattrib(parent,child,attribs){
  const c = document.getElementById(parent).getElementsByTagName(child);
  for (let i = 0; i < c.length; i++) {
    for (let key in attribs) {c[i].setAttribute(key, attribs[key]);}
  }
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