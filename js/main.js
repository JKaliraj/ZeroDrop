const main = document.querySelector("#main"),
myTheme = document.querySelector(".myTheme"),
splash = myTheme.querySelector("#splash"),
currentThemeIcon = main.querySelector(".currentThemeIcon"),
btn = main.querySelectorAll(".btn"),
homeBtn = main.querySelector(".homeBtn"),
welcome = main.querySelector(".welcome"),
themeSwitch = main.querySelector(".themeSwitch"),
sendBtn = main.querySelector(".sendBtn"),
sendBtnText = main.querySelector(".sendBtnText"),
receiveBtn = main.querySelector(".receiveBtn"),
receiveBtnText = main.querySelector(".receiveBtnText"),
dragArea = main.querySelector(".drag-area"),
receiveDiv = main.querySelector(".receive"),
progressArea = main.querySelector(".progress-area"),
uploadedArea = main.querySelector(".uploaded-area"),
showCode = main.querySelector(".showCode"),
digitCode1 = showCode.querySelector("#digitCode1"),
digitCode2 = showCode.querySelector("#digitCode2"),
digitCode3 = showCode.querySelector("#digitCode3"),
digitCode4 = showCode.querySelector("#digitCode4"),
filesDiv = main.querySelector(".files"),
codeNum1 = main.querySelector("#otc-1"),
codeNum2 = main.querySelector("#otc-2"),
codeNum3 = main.querySelector("#otc-3"),
codeNum4 = main.querySelector("#otc-4"),
downloadWindow = main.querySelector(".downloadWindow"),
FilesArea = main.querySelector(".files-area"),
uploadBtn = main.querySelector("#uploadButton");

// Theme
var theme = localStorage.getItem('theme');
if (theme) {
  myTheme.classList.add("dark");
  currentThemeIcon.classList.add("dark");
  dragArea.classList.add("dark");
  showCode.classList.add("dark");
  filesDiv.classList.add("dark");
  downloadWindow.classList.add("dark");
  FilesArea.classList.add("dark");
  splash.classList.add("dark");
  btn.forEach((ele) => {
    ele.classList.add("dark");
  });
  currentThemeIcon.innerText = "light_mode";
}
themeSwitch.addEventListener("click", () => {
  var themeIcon = currentThemeIcon.innerText;
  myTheme.classList.toggle("dark");
  currentThemeIcon.classList.toggle("dark");
  dragArea.classList.toggle("dark");
  showCode.classList.toggle("dark");
  filesDiv.classList.toggle("dark");
  downloadWindow.classList.toggle("dark");
  FilesArea.classList.toggle("dark");
  splash.classList.toggle("dark");

  btn.forEach((ele) => {
    ele.classList.toggle("dark");
  });
  if (themeIcon == "light_mode") {
    localStorage.removeItem('theme');
    currentThemeIcon.innerText = "dark_mode";
  } else {
    localStorage.setItem('theme', 'dark');
    currentThemeIcon.innerText = "light_mode";
  }
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Splash Screen
wait(1500).then(() => {
    main.style.display = "flex";
    splash.style.display = "none";
});

// Background Animation
function ani() {
  let c = document.createElement('canvas');
  document.body.appendChild(c);
  let style = c.style;
  style.width = '100%';
  style.position = 'absolute';
  style.zIndex = -1;
  style.top = 0;
  style.left = 0;
  let ctx = c.getContext('2d');
  let x0, y0, w, h, dw;

  function init() {
    w = window.innerWidth;
    h = window.innerHeight;
    c.width = w;
    c.height = h;
    let offset = h > 380 ? 100 : 65;
    offset = h > 800 ? 116 : offset;
    x0 = w / 2;
    y0 = h - 170;
    dw = Math.max(w, h, 1000) / 13;
    drawCircles();
  }
  window.onresize = init;

  function drawCircle(radius) {
    ctx.beginPath();
    let color = Math.round(255 * (1 - radius / Math.max(w, h)));
    ctx.strokeStyle = 'rgba(' + color + ',' + color + ',' + color + ',0.1)';
    ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 2;
  }

  let step = 0;

  function drawCircles() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) {
      drawCircle(dw * i + step % dw);
    }
    step += 1;
  }

  let loading = true;

  function animate() {
    if (loading || step % dw < dw - 5) {
      requestAnimationFrame(function () {
        drawCircles();
        animate();
      });
    }
  }
  window.animateBackground = function (l) {
    loading = l;
    animate();
  };
  init();
  animate();
}
ani();

//Navigation Controller 
var isAnyBtnClicked = false;
homeBtn.addEventListener("click", () => {
  if(isAnyBtnClicked){
    dragArea.style.display = "none";
    receiveDiv.style.display = "none";
    showCode.style.display = "none";
    downloadWindow.style.display = "none";
    sendBtnText.innerText="Send";
    receiveBtnText.innerText="Receive";
    receiveBtn.style.display="flex";
    sendBtn.style.display="flex";
    welcome.style.display = "flex";
  }else{
    window.location.reload();
  }
});

// Upload Area
uploadBtn.addEventListener('change', function(e){
  var file = e.target.files[0];
  uploadFile(file);
});

var ready=0;
var myCode;
var fileName;
const fileNameList=[];
const fileUrl=[];
function uploadFile(file) {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
  if(file){
    ready++;
    fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "..." + splitName[1];
    }
    if(ready==1){
      myCode =  Math.floor(Math.random() * 9000 + 1000);
      db.ref("space").orderByChild("code").equalTo(myCode).once("value", (snap) => {
        var data = snap.val();
        if(data!=null){
          myCode = Math.floor(Math.random() * 9000 + 1000);
        }
      });
      var cdate = new Date();
      var date = cdate.getDate();
      var mon = cdate.getMonth()+1;
      var year = cdate.getFullYear();
      var today = date+"-"+mon+"-"+year;
      setTimeout(() => {
        db.ref("space/" + myCode + "/").set({
          code: myCode,
          date : today
        });
        digitCode1.value=myCode.toString()[0];
        digitCode2.value=myCode.toString()[1];
        digitCode3.value=myCode.toString()[2];
        digitCode4.value=myCode.toString()[3];
      }, 1500);
    }
    var storageRef  = storage.ref(myCode+"/"+file.name);
    var uploadTask = storageRef.put(file);
    uploadTask.on('state_changed', loadUpload, errUpload, completeUpload);
    function loadUpload(snapshot){    
      let fileLoaded = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      let fileTotal = Math.floor(snapshot.totalBytes / 1000);
      let fileSize;
      (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (snapshot.bytesTransferred / (1024*1024)).toFixed(2) + " MB";
      let progressHTML = `<li class="row">
                            <span class="material-symbols-rounded">upload_file</span>
                            <div class="content">
                              <div class="details">
                                <span class="name">${fileName} • Uploading</span>
                                <span class="percent">${fileLoaded}%</span>
                              </div>
                              <div class="progress-bar">
                                <div class="progress" style="width: ${fileLoaded}%"></div>
                              </div>
                            </div>
                          </li>`;
      uploadedArea.classList.add("onprogress");
      progressArea.innerHTML = progressHTML;
      if(snapshot.bytesTransferred == snapshot.totalBytes){
        progressArea.innerHTML = "";
        let uploadedHTML = `<li class="row">
                              <div class="content upload">
                              <span class="material-symbols-rounded">task</span>
                                <div class="details">
                                  <span class="name">${fileName}</span>
                                  <span class="size">${fileSize}</span>
                                </div>
                              </div>
                              <span class="material-symbols-rounded">done</span>
                            </li>`;
        uploadedArea.classList.remove("onprogress");
        uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
      }
    }
    function errUpload(err){   
              console.log(err)    
    }
    function completeUpload(){
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        var fname = file.name;
        fileUrl.push(downloadURL);
        fileNameList.push(fname);
        db.ref("space/" + myCode + "/").update({
          fileUrl: fileUrl,
          fileName:fileNameList
        });
      });
    }
  }
}

const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
let file;

button.onclick = ()=>{
  input.click();
}

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault();
  var file = event.dataTransfer.files[0];
  if(file){
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
    uploadFile(file);
  }  
});

// Send
sendBtn.addEventListener("click", () => {
  welcome.style.display = "none";
  dragArea.style.display = "flex";
  downloadWindow.style.display = "none";
  receiveBtn.style.display="none";
  isAnyBtnClicked = true;
  if (sendBtnText.innerText=="Upload" && ready!=0) {
    dragArea.style.display = "none";
    showCode.style.display = "flex";
    sendBtn.style.display="none";
  } else {
      sendBtnText.innerText="Upload";
  }
})
receiveBtn.addEventListener("click", () => {
  isAnyBtnClicked = true;
  welcome.style.display = "none";
  receiveDiv.style.display = "block";
  downloadWindow.style.display = "block";
  sendBtn.style.display="none";
  if (receiveBtnText.innerText=="Download") {
    if (codeNum1.value=="" || codeNum2.value=="" || codeNum3.value==""  || codeNum4.value=="") {
      document.querySelector('#alert-text').textContent = 'Please Enter Valid Code';
      document.querySelector('.alert').classList.toggle('alertnow');
      wait(3000).then(() => {
        document.querySelector('.alert').classList.toggle('alertnow');
      });
    }else{
      var myCodeReceive = codeNum1.value+codeNum2.value+codeNum3.value+codeNum4.value;
      db.ref("space/"+myCodeReceive).once('value', (snap) => {
        var data = snap.val();
        if(data){
          FilesArea.innerHTML = '';
          var fileName = data['fileName'];
          var fileUrl = data['fileUrl'];
          fileUrl.forEach((file,i) => {
            console.log(file,fileName[i]);
            var uploadedHTML = `<li class="row">
                            <div class="content upload">
                            <span class="material-symbols-rounded">task</span>
                              <div class="details">
                                <span class="name">${fileName[i]}</span>
                              </div>
                            </div>
                            <a href=${file} target="_blank" download><span class="material-symbols-rounded">download</span></a>
                          </li>`;
            FilesArea.insertAdjacentHTML("afterbegin", uploadedHTML);
          });
        }
      });
    }
  } else {
    receiveBtnText.innerText="Download";
  }
})

let in1 = document.getElementById("otc-1"),
	ins = document.querySelectorAll('input[type="number"]'),
	splitNumber = function (e) {
		let data = e.data || e.target.value;
		if (!data) return;
		if (data.length === 1) return;
		popuNext(e.target, data);
	},
	popuNext = function (el, data) {
		el.value = data[0]; 
		data = data.substring(1);
		if (el.nextElementSibling && data.length) {
			popuNext(el.nextElementSibling, data);
		}
	};

ins.forEach(function (input) {
	input.addEventListener("keyup", function (e) {
		if (
			e.keyCode === 16 ||
			e.keyCode == 9 ||
			e.keyCode == 224 ||
			e.keyCode == 18 ||
			e.keyCode == 17
		) {
			return;
		}
		if (
			(e.keyCode === 8 || e.keyCode === 37) &&
			this.previousElementSibling &&
			this.previousElementSibling.tagName === "INPUT"
		) {
			this.previousElementSibling.select();
		} else if (e.keyCode !== 8 && this.nextElementSibling) {
			this.nextElementSibling.select();
		}
		if (e.target.value.length > 1) {
			splitNumber(e);
		}
	});
	input.addEventListener("focus", function (e) {
		if (this === in1) return;
		if (in1.value == "") {
			in1.focus();
		}
		if (this.previousElementSibling.value == "") {
			this.previousElementSibling.focus();
		}
	});
});
in1.addEventListener("input", splitNumber);

