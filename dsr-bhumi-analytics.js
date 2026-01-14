// GENRATE UNIC ID
function unique10(){
  let arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % 9000000000 + 1000000000).toString();
};

// GENRATE DATE FORMET
function formatDate(d = new Date()){
  const days = ["sun","mon","tue","wed","thu","fri","sat"];
  let day = days[d.getDay()];
  let dd = String(d.getDate()).padStart(2,"0");
  let mm = String(d.getMonth()+1).padStart(2,"0");
  let yyyy = d.getFullYear();
  let hh = d.getHours();
  let a = hh >= 12 ? "pm" : "am"; hh = hh % 12 || 12;
  let min = String(d.getMinutes()).padStart(2,"0");
  let sec = String(d.getSeconds()).padStart(2,"0");
  return `${day} ${dd}/${mm}/${yyyy} ${hh}:${min}:${sec} ${a}`;
};



// GLOBAL DATA STOR VAREBAL
let data = {};

// DEVICE INFO
function deviceInfoFun(){
  const devices = { iPad:/iPad/, iPhone:/iPhone/, Android:/Android/, Windows:/Windows/ };
  for(let d in devices){ if(devices[d].test(navigator.userAgent)){ data.device = d; break; } }
} deviceInfoFun();


// CLICKS COUNT INFO
function clicksInfoFun(){
  let clicks = JSON.parse(localStorage.getItem("clicks") || "{}");
  let page = location.pathname || "home";
  document.addEventListener("click", function(e){
    // page click
    clicks[page] = (clicks[page] || 0) + 1;
    // total click
    clicks.total = (clicks.total || 0) + 1;
    localStorage.setItem("clicks", JSON.stringify(clicks));
  });
  //data.clicksInfo = JSON.stringify(clicks);
  data.clicksInfo = clicks;
} clicksInfoFun();

// VIEWS COUNT
function viewsCountFun(){
  let views = JSON.parse(localStorage.getItem("views") || "{}");
  let page = location.pathname || "home";
  // page count
  views[page] = (views[page] || 0) + 1;
  // total count
  views.total = (views.total || 0) + 1;
  localStorage.setItem("views", JSON.stringify(views));
  //data.viewsInfo = JSON.stringify(views);
  data.viewsInfo = views;
} viewsCountFun();

// TITLE HISTORY
function titleHisFun(){
  let title = document.title.trim();
  let history = JSON.parse(localStorage.getItem("titleHistory") || "[]");
  // agar last title same nahi hai tabhi add karo
  if(history[history.length - 1] !== title){ history.push(title); }
  // max 100 history limit (optional)
  if(history.length > 100){ history.shift(); }
  localStorage.setItem("titleHistory", JSON.stringify(history));
  //data.titleHistory = JSON.stringify(history);
  data.titleHistory = history;
} titleHisFun();

// SCREEN INFO
function screenInfoFun(){
  let display = { width:screen.width, height:screen.height };
  //data.screenInfo = JSON.stringify(display);
  data.screenInfo = display;
} screenInfoFun();

// BROWSER INFO
function browserInfoFun(){
  let ua = navigator.userAgent, name="Unknown", ver="Unknown";
  const browsers = [ ["Edge","Edg\/([\\d.]+)"], ["Chrome","Chrome\/([\\d.]+)"], ["Firefox","Firefox\/([\\d.]+)"], ["Safari","Version\/([\\d.]+)"] ];
  for(let b of browsers){
    let m = ua.match(new RegExp(b[1])); if(m){ name=b[0]; ver=m[1]; break; }
  }
  let browserData = { browserName:name, fullVersion:ver, majorVersion:parseInt(ver)||0, appName:navigator.appName, userAgent:ua };
  //data.browserInfo = JSON.stringify(browserData);
  data.browserInfo = browserData;
} browserInfoFun();

// CONNECTION INFO
function connInfoFun(){
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if(conn){
    let networkData = { type:conn.effectiveType, downlink:conn.downlink, rtt:conn.rtt, saveData:conn.saveData };
    //data.connectionInfo = JSON.stringify(networkData);
    data.connectionInfo = networkData;
  }
} connInfoFun();

// BATTERY INFO
function batteryInfoFun(){
  if(navigator.getBattery){
    navigator.getBattery().then(b=> {
      let batteryData = { charging:b.charging, level:(b.level*100).toFixed(2)+"%", chargingTime:b.chargingTime, dischargingTime:b.dischargingTime };
      //data.batteryInfo = JSON.stringify(batteryData);
      data.batteryInfo = batteryData;
    });
  }
} batteryInfoFun();

// IP INFO OUTPUT
let timeOut;
function getIpInfo(json){
  clearTimeout(timeOut);
  if(json && typeof json === "object"){
    delete json.readme; data.ipInfo = json; sendDataServer();
  }else{
     let sc = document.createElement("script");
     sc.src = "https://ipinfo.io/?format=jsonp&callback=getIpInfo"; sc.type = "application/javascript";
     sc.onerror = function(){ sendDataServer(); }
     document.head.appendChild(sc);
     timeOut = setTimeout(function(){ sendDataServer(); },10000);
  } 
}; getIpInfo();

// SEND DATA SERVER
function sendDataServer(){
  //alert(localStorage.getItem("id"))
  data.dateTime = formatDate();
  //document.body.innerHTML = '<pre>'+JSON.stringify(data,null,2)+'</pre>'; 
  //alert("My public IP address is:\n"+JSON.stringify(data,null,2));
}; 

document.ondblclick = function(){
  if(confirm("This is show data")){
    document.body.innerHTML = '<pre>'+JSON.stringify(data,null,2)+'</pre>';
    if(confirm("This is clear data")){ localStorage.clear(); }
  }
}


