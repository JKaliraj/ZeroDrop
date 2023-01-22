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
  downloadInputCode = main.querySelectorAll(".downloadcode"),
  downloadWindow = main.querySelector(".downloadWindow"),
  FilesArea = main.querySelector(".files-area"),
  uploadBtn = main.querySelector("#uploadButton");

// Theme
var theme = localStorage.getItem("theme");
if (theme) {
  homeBtn.src = "./assests/arrow-left-w.svg";
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
  currentThemeIcon.src = "./assests/sun.svg";
}
themeSwitch.addEventListener("click", () => {
  var themeIcon = currentThemeIcon.src;
  myTheme.classList.toggle("dark");
  dragArea.classList.toggle("dark");
  showCode.classList.toggle("dark");
  filesDiv.classList.toggle("dark");
  downloadWindow.classList.toggle("dark");
  FilesArea.classList.toggle("dark");
  splash.classList.toggle("dark");

  btn.forEach((ele) => {
    ele.classList.toggle("dark");
  });
  if (themeIcon.includes("sun.svg")) {
    localStorage.removeItem("theme");
    currentThemeIcon.src = "./assests/moon.svg";
    homeBtn.src = "./assests/arrow-left.svg";
  } else {
    localStorage.setItem("theme", "dark");
    currentThemeIcon.src = "./assests/sun.svg";
    homeBtn.src = "./assests/arrow-left-w.svg";
  }
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Splash Screen
wait(1500).then(() => {
  main.style.display = "flex";
  splash.style.display = "none";
});

// Background Animation
function ani() {
  let c = document.createElement("canvas");
  document.body.appendChild(c);
  let style = c.style;
  style.width = "100%";
  style.position = "absolute";
  style.zIndex = -1;
  style.top = 0;
  style.left = 0;
  let ctx = c.getContext("2d");
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
    ctx.strokeStyle = "rgba(" + color + "," + color + "," + color + ",0.1)";
    ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 2;
  }

  let step = 0;

  function drawCircles() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) {
      drawCircle(dw * i + (step % dw));
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
  if (isAnyBtnClicked) {
    dragArea.style.display = "none";
    receiveDiv.style.display = "none";
    showCode.style.display = "none";
    downloadWindow.style.display = "none";
    sendBtnText.innerText = "Send";
    receiveBtnText.innerText = "Receive";
    receiveBtn.style.display = "flex";
    sendBtn.style.display = "flex";
    welcome.style.display = "flex";
  } else {
    window.location.reload();
  }
});

// Upload Area
uploadBtn.addEventListener("change", function (e) {
  var file = e.target.files;
  var filelength = e.target.files.length;
  for (var i = 0; i < filelength; i++) {
    if (!fileNameList.includes(file[i].name)) {
      uploadFile(file[i]);
    }
  }
});

var ready = 0;
var myCode;
let fileSize;
const fileNameList = [];
const fileUrl = [];
const fileSizeList = [];
function uploadFile(file) {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
  if (file) {
    ready++;
    var fileName = file.name;
    if (fileName.length >= 12) {
      let splitName = fileName.split(".");
      fileName = splitName[0].substring(0, 13) + "..." + splitName[1];
    }
    if (ready == 1) {
      myCode = Math.floor(Math.random() * 9000 + 1000);
      db.ref("space")
        .orderByChild("code")
        .equalTo(myCode)
        .once("value", (snap) => {
          var data = snap.val();
          if (data != null) {
            myCode = Math.floor(Math.random() * 9000 + 1000);
          }
        });
      var cdate = new Date();
      var year = cdate.getFullYear();
      var hour = cdate.getHours();
      var min = cdate.getMinutes();
      var mon = ("0" + (cdate.getMonth() + 1)).slice(-2);
      var date = ("0" + cdate.getDate()).slice(-2);

      var today = date + "-" + mon + "-" + year;
      var ctime = hour + ":" + min;
      setTimeout(() => {
        db.ref("space/" + myCode + "/").set({
          code: myCode,
          date: today,
          time: ctime,
          count: 0,
        });
        digitCode1.value = myCode.toString()[0];
        digitCode2.value = myCode.toString()[1];
        digitCode3.value = myCode.toString()[2];
        digitCode4.value = myCode.toString()[3];
      }, 1500);
    }
    var storageRef = storage.ref(myCode + "/" + file.name);
    var uploadTask = storageRef.put(file);
    uploadTask.on("state_changed", loadUpload, errUpload, completeUpload);
    function loadUpload(snapshot) {
      let fileLoaded = Math.floor(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      let fileTotal = Math.floor(snapshot.totalBytes / 1000);
      fileTotal < 1024
        ? (fileSize = 1 + fileTotal + " KB")
        : (fileSize =
            (snapshot.bytesTransferred / (1024 * 1024)).toFixed(2) + " MB");
      let progressHTML = `<li class="row">
                            <img src="./assests/clock.svg">
                            <div class="content">
                              <div class="details">
                                <span class="name">${fileName} Uploading</span>
                                <span class="percent">${fileLoaded}%</span>
                              </div>
                              <div class="progress-bar">
                                <div class="progress" style="width: ${fileLoaded}%"></div>
                              </div>
                            </div>
                          </li>`;
      uploadedArea.classList.add("onprogress");
      progressArea.innerHTML = progressHTML;
      if (snapshot.bytesTransferred == snapshot.totalBytes) {
        progressArea.innerHTML = "";
        let uploadedHTML = `<li class="row">
                              <div class="content upload">
                              <img src="./assests/file-g.svg">
                                <div class="details">
                                  <span class="name">${fileName}</span>
                                  <span class="size">${fileSize}</span>
                                </div>
                              </div>
                              <img src="./assests/check.svg">
                            </li>`;
        uploadedArea.classList.remove("onprogress");
        uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
      }
    }
    function errUpload(err) {
      console.log(err);
    }
    function completeUpload() {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        var fname = file.name;
        fileUrl.push(downloadURL);
        fileNameList.push(fname);
        fileSizeList.push(fileSize);
        db.ref("space/" + myCode + "/").update({
          fileUrl: fileUrl,
          fileSize: fileSizeList,
          fileName: fileNameList,
        });
      });
    }
  }
}

const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input");

button.onclick = () => {
  input.click();
};

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  var dragfile = event.dataTransfer.files;
  var dragfilelength = event.dataTransfer.files.length;
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
  if (dragfile) {
    for (var i = 0; i < dragfilelength; i++) {
      if (dragfile[i].type !== "" && !fileNameList.includes(dragfile[i].name)) {
        uploadFile(dragfile[i]);
      }
    }
  }
});

// Send
sendBtn.addEventListener("click", () => {
  welcome.style.display = "none";
  dragArea.style.display = "flex";
  downloadWindow.style.display = "none";
  receiveBtn.style.display = "none";
  isAnyBtnClicked = true;
  if (sendBtnText.innerText == "Upload" && ready != 0) {
    dragArea.style.display = "none";
    showCode.style.display = "flex";
    sendBtn.style.display = "none";
  } else {
    sendBtnText.innerText = "Upload";
  }
});
var breakitcount = 0;
receiveBtn.addEventListener("click", () => {
  isAnyBtnClicked = true;
  welcome.style.display = "none";
  receiveDiv.style.display = "block";
  downloadWindow.style.display = "block";
  sendBtn.style.display = "none";
  if (receiveBtnText.innerText == "Receive") {
    main.querySelector(".focusme").focus();
  }
  if (receiveBtnText.innerText == "Download") {
    if (downloadInputCode[3].disabled && downloadInputCode[3].value == "") {
      document.querySelector("#alert-text").textContent =
        "Please Enter Valid Code";
      document.querySelector(".alert").classList.toggle("alertnow");
      wait(3000).then(() => {
        document.querySelector(".alert").classList.toggle("alertnow");
      });
    } else {
      var myCodeReceive = 0;
      downloadInputCode.forEach((input) => {
        myCodeReceive = myCodeReceive * 10 + parseInt(input.value);
      });
      db.ref("space/" + myCodeReceive).once("value", (snap) => {
        if (snap.exists()) {
          var data = snap.val();
          if (data) {
            FilesArea.innerHTML = "";
            var fileName = data["fileName"];
            var fileUrl = data["fileUrl"];
            fileUrl.forEach((file, i) => {
              var uploadedHTML = `<li class="row">
                            <div class="content upload">
                            <img src="./assests/file-g.svg">
                              <div class="details">
                                <span class="name">${fileName[i]}</span>
                              </div>
                            </div>
                            <img class="downloadFileIcon" src="./assests/download-g.svg" onclick="downloadFile('${file}','${fileName[i]}')">
                            </li>`;
              FilesArea.insertAdjacentHTML("afterbegin", uploadedHTML);
            });
            breakitcount += 1;
            if (breakitcount == 1) {
              db.ref("space/" + myCodeReceive + "/").update({
                count: firebase.database.ServerValue.increment(1),
              });
            }
          }
        } else {
          document.querySelector("#alert-text").textContent =
            "Wrong Download Code 👻";
          document.querySelector(".alert").classList.toggle("alertnow");
          wait(3000).then(() => {
            document.querySelector(".alert").classList.toggle("alertnow");
          });
        }
      });
    }
  } else {
    receiveBtnText.innerText = "Download";
  }
});

downloadInputCode.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    // This code gets the current input element and stores it in the currentInput variable
    // the next sibling element of the current input element and stores it in the nextInput variable
    // the previous sibling element of the current input element and stores it in the prevInput variable
    const currentInput = input,
      nextInput = input.nextElementSibling,
      prevInput = input.previousElementSibling;

    // if the value has more than one character then clear it
    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }
    // if the next input is disabled and the current value is not empty
    //  enable the next input and focus on it
    if (
      nextInput &&
      nextInput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    // if the backspace key is pressed
    if (e.key === "Backspace") {
      // iterate over all inputs again
      downloadInputCode.forEach((input, index2) => {
        // if the index1 of the current input is less than or equal to the index2 of the input in the outer loop
        // and the previous element exists, set the disabled attribute on the input and focus on the previous element
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }
    //if the fourth input( which index number is 3) is not empty and has not disable attribute then
    //add active class if not then remove the active class.
    if (!downloadInputCode[3].disabled && downloadInputCode[3].value !== "") {
      return;
    }
  });
});

function downloadFile(url, filename) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = (event) => {
    var blob = xhr.response;
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.dispatchEvent(new MouseEvent("click"));
  };
  xhr.open("GET", url);
  xhr.send();
}
