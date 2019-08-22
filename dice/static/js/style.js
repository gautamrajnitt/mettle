class DieCube{
    constructor(el,config){
      let DC = this;
      DC.diecube = el;
      DC.audiourl = config.au;
    //   DC.restflat = config.rf;
      DC.callback = config.cb;
      DC.rollTimer1 = 0;
      DC.rollTimer2 = 0;
      DC.rollxy = {x:0,y:0};
      DC.lastRoll = 0;
      DC.chosenDie = 0;
      DC.getSize();
      DC.createDieUI();
      DC.diecube.addEventListener("click",function(){DC.roll();},false);
    }
    getSize(){
      let DC = this;
      DC.size = window.getComputedStyle(DC.diecube).getPropertyValue('--size');
      DC.sizeint = parseInt(DC.size);
      DC.sizesuffix = DC.size.substring(String(DC.sizeint).length);
      DC.perspective = (DC.sizeint * 4) + DC.sizesuffix;
    }
    // setFlat(bool){
    //   let DC = this;
    //   if (DC.callback.getFlat){
    //     bool = DC.callback.getFlat();
    //   }
    //   DC.restflat = bool;
    // }
    getXY(){
      let DC = this;
      return DC.xy;
    }
    goXY(x,y){
      this.resetDieCubeRotation();
      this.rotateDieCube(x,y);
    }
    show(num = 0){
      let DC = this;
      num = Number(num);
      DC.chosenDie = 0;
      if (num > 0) {DC.chosenDie = num;}
      DC.stopRoll();
    }
    roll(num = 0){
      let DC = this;
      /* optional: add beforeRoll and showResult functions to 
        the callback object that instantiated DieCube */
      if (DC.callback.beforeRoll){
        DC.callback.beforeRoll();
      }
      num = Number(num);
      DC.chosenDie = 0;
      if (num > 0) {DC.chosenDie = num;}
      clearInterval(DC.rollTimer1);
      clearInterval(DC.rollTimer2);
      let rollTime = DC.randRange(800,1600);
      this.rollTimer1 = setInterval(function(){DC.randrot();},20);
      this.rollTimer2 = setTimeout(function(){DC.stopRoll();},rollTime);
      if (DC.callback.showResult){
        DC.callback.showResult("Rolling...");
      }
    //   if (DC.audioplayer){
    //     DC.audioplayer.currentTime = 0;
    //     DC.audioplayer.play();
    //   }
    }
    randrot(){
      let DC = this;
      let rx = DC.randRange(45,90);
      let ry = DC.randRange(45,90);
      DC.rollxy.x = DC.rollxy.x + rx;
      DC.rollxy.y = DC.rollxy.y  + ry;
      DC.rotateDieCube(DC.rollxy.x, DC.rollxy.y );
    }
    stopRoll(){
      let DC = this;
      clearInterval(DC.rollTimer1);
      clearTimeout(DC.rollTimer2);
      let val = DC.chosenDie > 0 ? DC.chosenDie-1 : DC.randRange(0,5);
      this.lastRoll = val + 1;
      let xys = [[0,0],[0,270],[90,0],[270,0],[0,90],[0,180]];
      let rx = DC.randRange(10,12);
      let ry = DC.randRange(10,12);
      DC.getSize();
      if (DC.sizesuffix === "px"){
        let sizepc = Math.pow(140, 0.2)/Math.pow(DC.sizeint, 0.2);
        rx = rx * sizepc;
        ry = ry * sizepc;
      }
      rx = Math.floor(rx) % 2 === 0 ? rx : (1 + rx) * -1;
      ry = Math.floor(ry) % 2 === 0 ? ry : (1 + ry) * -1;
    //   DC.setFlat();
    //   if (DC.restflat){
    //     rx = ry = 0;
    //   }
      DC.goXY(xys[val][0] + rx, xys[val][1] + ry);
      if (DC.callback.showResult){
        DC.callback.showResult("You rolled a " + DC.lastRoll + ".");
      }
      DC.rollxy.x = 0;
      DC.rollxy.y = 0;
    }
    rotateDieCube(x,y){
      let DC = this;
      x = Math.floor(x);
      y = Math.floor(y);
      this.diecube.style.transform = `perspective(${this.perspective}) rotateY(${x}deg) rotateX(${y}deg) translateZ(0)`;
      DC.xy = {x:x,y:y};
    }
    resetDieCubeRotation(){
      this.diecube.style.transform = "perspective("+this.perspective+")";
    }
    createDieUI(){
      let DC = this;
      let code = "";
      let faces = ["back","right","left","top","bottom","front"];
      let dotlist = [[1,2,3,7,8,9],[1,3,7,9],[1,5,9],[1,9],[1,3,5,7,9],[5]];
      for (let i=0;i<faces.length;i++){
        let facedots = dotlist[i];
        code += `<div class="dieface dieface--${faces[i]}">`;
        for (let j=0;j<facedots.length;j++){
          code += `<div class="dot dot--${facedots[j]}"></div>`;
        }
        code += `</div>`;
      }
      DC.diecube.innerHTML = code;
      //create a button for keyboard accessibility
      DC.rollbutton = document.createElement("button");
      DC.rollbutton.innerHTML = "Play Audio";
      DC.diecube.appendChild(DC.rollbutton);
      DC.rollbutton.style.opacity = "0";
      DC.rollbutton.style.border = "0 none;";
      DC.rollbutton.style.width = "100%";
      DC.rollbutton.style.height = "100%";
      DC.rollbutton.addEventListener("click",function(){DC.roll();},false);
    //   if (DC.audiourl){
    //     DC.audioplayer = document.createElement("audio");
    //     DC.audioplayer.src = DC.audiourl;
    //     DC.diecube.appendChild(DC.audioplayer);
    //   }
    }
    //random integer utility function
    randRange(min, max) {
      return Math.floor(Math.random()*(max-min+1))+min;
    }
  }
  /* UI Code Below */
  //gather the range input elements and labels
  let jsl = document.querySelectorAll(".jsl");
  let jsi = document.querySelectorAll(".jsi");
  //arrays to hold the dice containers and the dice objects
  let diceDivs, dice; 
  
  function init(){
    //do stuff here after the DOM loads
    diceDivs = document.querySelectorAll('.diecube');
    dice = [];
    //instantiate the DieCube objects
    for (let i=0;i<diceDivs.length;i++){
      let audioindex = i % 2 === 0 ? "0" : "1";
      let dieaudio = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/358203/diceroll"+audioindex+".mp3";
    //   let restflat = gid("flatcheck").checked;
      let config = {au:dieaudio,cb:this};
      dice.push( new DieCube(diceDivs[i],config) );
    }
    gid("actionBtn").addEventListener("click",doAction,false);
    for (let i=0;i<dice.length;i++){
      dice[i].show();
    }
    for (let i=0;i<jsi.length;i++){
      //trigger update on change or input
      jsi[i].addEventListener("input",function(){
        showSliderValue(i);
        updateDieCube();
      });
      showSliderValue(i);
    }
  }
  // optional: getFlat, beforeRoll, and showResult handle communication from DieCube class
//   function getFlat(){
//     return gid("flatcheck").checked;
//   }
  function beforeRoll(){
    for (let i=0;i<jsi.length;i++){
      jsi[i].value = 0;
      showSliderValue(i);
    }
  }
  function showResult(r){
    let dicevalues = [];
    for (let i=0;i<dice.length;i++){
      dicevalues.push(dice[i].lastRoll);
    }
    document.getElementById("rollResult").innerHTML = dicevalues.toString();
    flag = 0;
    for(m=0;m<4;m++) {
        flag += dicevalues[m];
    }
    document.getElementById("sumResult").innerHTML = flag.toString();
  }
  function showSliderValue(i){
    jsl[i].innerHTML = jsi[i].value;
  }
//   function checkInput(){
//     let vtext = gid("inputFld").value;
//     let regex = /0|1|2|3|4|5|6/;
//     if (!regex.test(vtext) || vtext.length > 1){
//       gid("inputFld").value = "0";
//     }
//   }
  function doAction(){
    let val = 0;
    for (let i=0;i<dice.length;i++){
      dice[i].roll(Number(val));
    }
    let df = gid("dicefield");
    df.style.transition = "all 0s linear";
    df.style.top = "-100%";
    df.style.transform = "scale(0.01)";
    setTimeout(animateDiceField,100);
  }
  function animateDiceField(){
    let df = gid("dicefield");
    df.style.transition = "all 0.8s cubic-bezier(.78,.34,.68,1.3)";
    df.style.top = "20px";
    df.style.transform = "scale(1) translateZ(1px)";
  }
  function updateDieCube(){
    let newxy = [];
    for (let i=0;i<jsi.length;i++){
      newxy.push(Number(jsi[i].value));
    }
    for (let i=0;i<dice.length;i++){
      dice[i].goXY(...newxy);
    }
  }
  // utility functions to avoid need for jquery
  function randRange(min, max) {
    return Math.floor(Math.random()*(max-min+1))+min;
  }
  function gid(idstring){
    return document.getElementById(idstring);
  }
  function qs(selectorstring){
    return document.querySelector(selectorstring);
  }
  function qsa(selectorstring){
    return document.querySelectorAll(selectorstring);
  }
  document.addEventListener('DOMContentLoaded', function (e) {
    try {init();} catch (error){console.log("Data didn't load", error);}
  });