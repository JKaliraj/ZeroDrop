const main = document.querySelector(".main"),
  codes = main.querySelector(".codes"),
  welcome = main.querySelector(".mainPanel .welcome");

db.ref("space")
  .orderByChild("time")
  .on("child_added", (snap) => {
    var datas = snap.val();
        db.ref("space/" + datas['code']).once("value", (snap) => {
            var data = snap.val();
            if (data) {
              var listCodeHTML = ` <div class="row" onclick="getUserFiles(${data['code']},this)">
                                        <img src="./assests/hash.svg">
                                        <span class="textCode">${data['code']}</span>
                                        <span class="time">${data['time']}</span>
                                    </div>`;
    
              codes.innerHTML += listCodeHTML;
            }
          });
        });

function getUserFiles(code, current) {
  welcome.style.display = "none";
  var currentActive = main.querySelector(".active");
  if (currentActive) {
    currentActive.classList.remove("active");
  }
  current.classList.add("active");
  db.ref("space/" + code).once("value", (snap) => {
    if (snap.exists()) {
      var data = snap.val();
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
                            <img class="downloadFileIcon" src="./assests/download-g.svg" onclick=downloadFile('${file}','${fileName[i]}')>
                            </li>`;
        FilesArea.insertAdjacentHTML("afterbegin", uploadedHTML);
      });
    }
  });
}
