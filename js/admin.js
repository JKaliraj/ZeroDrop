const main = document.querySelector(".main"),
  codes = main.querySelector(".codes"),
  mainPanel = main.querySelector(".mainPanel"),
  welcome = main.querySelector(".mainPanel .welcome"),
  mainListFiles = main.querySelector(".mainPanel .mainListFiles"),
  menuPanel = main.querySelector(".menuPanel"),
  downloadCounter = main.querySelector(".downloadCount span"),
  fileValidity = main.querySelector(".fileValidity span"),
  addNew = main.querySelector(".addnew"),
  removeFile = main.querySelector(".removefile"),
  reCode = main.querySelector(".recode"),
  deleteBtn = main.querySelector(".delete"),
  keepBtn = main.querySelector(".keep");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

db.ref("space")
  .orderByChild("time")
  .on("child_added", (snap) => {
    var datas = snap.val();
    db.ref("space/" + datas["code"]).once("value", (snap) => {
      var data = snap.val();
      if (data) {
        var listCodeHTML = ` <div class="row" data-code="${data["code"]}" onclick="getUserFiles(${data["code"]},this)">
                                        <img src="./assests/hash.svg">
                                        <span class="textCode">${data["code"]}</span>
                                        <span class="time">${data["time"]}</span>
                                    </div>`;

        codes.innerHTML += listCodeHTML;
      }
    });
  });

function getUserFiles(code, current) {
  var mainListFiles = main.querySelector(".mainListFiles");
  mainListFiles.classList.add("mainListFilesActive");
  welcome.style.display = "none";
  menuPanel.style.right = "0";
  var currentActive = main.querySelector(".active");
  if (currentActive) {
    currentActive.classList.remove("active");
  }
  current.classList.add("active");

  db.ref("space/" + code).on("value", (snap) => {
    mainListFiles.innerHTML = "";
    if (snap.exists()) {
      var data = snap.val();
      var fileName = data["fileName"];
      var fileUrl = data["fileUrl"];
      var fileSize = data["fileSize"];
      var count = data["count"];
      var validity = data["date"];
      downloadCounter.innerText = count;
      fileValidity.innerText = validity;
      fileUrl.forEach((file, i) => {
        var filename = fileName[i];
        if (filename.length >= 25) {
          let splitName = filename.split(".");
          filename = splitName[0].substring(0, 24) + "...";
        }
        var dataHTML = `<div class="box">
                              <img src="./assests/file-text.svg">
                              <h2>${filename}</h2>
                              <span>${fileSize[i]}</span>
                              <img class="viewFileIcon" src="./assests/external-link-w.svg" onclick="viewFile('${file}')">
                              <img class="downloadFileIcon" src="./assests/download-w.svg" onclick="downloadFile('${file}','${fileName[i]}')">
                          </div>`;
        mainListFiles.innerHTML += dataHTML;
      });
    }
  });
}

function viewFile(url) {
  window.open(url);
}

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

keepBtn.addEventListener("click", () => {
  var newdate;
  var currentActive = main.querySelector(".active");
  db.ref("space/" + currentActive.dataset.code).once("value", (snap) => {
    if (snap.exists()) {
      var data = snap.val();
      var date = data["date"];
      var parts = date.split("-");
      if (Number(parts[0]) >= 30) {
        var addtwo = ("0" + (Number(parts[1]) + 1)).slice(-2);
        newdate = ("0" + 1).slice(-2) + "-" + addtwo + "-" + parts[2];
      } else {
        var addtwo = ("0" + (Number(parts[0]) + 2)).slice(-2);
        newdate = addtwo + "-" + parts[1] + "-" + parts[2];
      }
    }
  });
  db.ref("space/" + currentActive.dataset.code + "/").update({
    date: newdate,
  });
  document.querySelector("#alert-text").textContent = "Added +2 Days Validity";
  document.querySelector(".alert").classList.toggle("alertnow");
  wait(3000).then(() => {
    document.querySelector(".alert").classList.toggle("alertnow");
  });
});

deleteBtn.addEventListener("click", () => {
  document.querySelector("#alert-text").textContent = "Deleting Folder 📂";
  document.querySelector(".alert").classList.toggle("alertnow");
  wait(3000).then(() => {
    document.querySelector(".alert").classList.toggle("alertnow");
    var currentActive = main.querySelector(".active");
    db.ref("space/" + currentActive.dataset.code).once("value", (snap) => {
      var data = snap.val();
      var file = data["fileName"];
      file.forEach((element) => {
        storage
          .ref(currentActive.dataset.code)
          .child(element.toString())
          .delete();
      });
    });
    db.ref("space/" + currentActive.dataset.code + "/").remove();
    codes.removeChild(currentActive);
    mainListFiles.classList.remove("mainListFilesActive");
    welcome.style.display = "flex";
    menuPanel.style.right = "-250px";
  });
});

reCode.addEventListener("click", () => {});

// Login
function login() {
  var username = document.getElementById("userid").value;
  var password = document.getElementById("passwd").value;
  if (!username || !password) {
    document.querySelector("#alert-text").textContent =
      "Enter Username and Password";
    document.querySelector(".alert").classList.toggle("alertnow");
    wait(3000).then(() => {
      document.querySelector(".alert").classList.toggle("alertnow");
    });
    return;
  } else {
    db.ref()
      .child("users")
      .child(username)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          if (username == snapshot.val()["username"]) {
            if (password == snapshot.val()["password"]) {
              document.querySelector(".signin").style.display = "none";
              document.querySelector(".main").style.display = "flex";
            } else {
              document.querySelector("#alert-text").textContent =
                "Access Denied";
              document.querySelector(".alert").classList.toggle("alertnow");
              document.getElementById("passwd").value = "";
              wait(3000).then(() => {
                document.querySelector(".alert").classList.toggle("alertnow");
              });
            }
          }
        } else {
          document.querySelector("#alert-text").textContent =
            "Unrecognized access";
          document.querySelector(".alert").classList.toggle("alertnow");
          document.getElementById("userid").value = "";
          document.getElementById("passwd").value = "";
          wait(3000).then(() => {
            document.querySelector(".alert").classList.toggle("alertnow");
          });
        }
      });
  }
}
