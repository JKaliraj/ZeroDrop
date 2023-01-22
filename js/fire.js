//Replace Your own Firebase Config in this project
/*
const firebaseConfig = {
    apiKey: "YOUR_API",
    authDomain: "YOUR_DOMAIN",
    projectId: "PROJECT_ID",
    databaseURL: "YOUR_DATABASE_URL",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MSG_ID",
    appId: "APP_ID",
    measurementId: "MEASUREMENT_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage  = firebase.storage();
*/

// remove older files >24hr
db.ref("space").once("value", (snap) => {
  var datas = snap.val();
  if (datas) {
    const code = Object.keys(datas);
    db.ref("space/" + code[0]).once("value", (snap) => {
      var data = snap.val();
      if (data) {
        var sdate = data["date"];
        var cdate = new Date();
        var date = cdate.getDate();
        var mon = cdate.getMonth() + 1;
        var year = cdate.getFullYear();
        var today = date + "-" + mon + "-" + year;
        var parts = sdate.split("-");
        var months = ("0" + parts[1]).slice(-2);
        var dates = ("0" + parts[0]).slice(-2);
        d1 = Number(parts[2] + months + dates);

        parts = today.split("-");
        var months = ("0" + parts[1]).slice(-2);
        var dates = ("0" + parts[0]).slice(-2);
        d2 = Number(parts[2] + months + dates);

        if (d1 < d2) {
          var file = data["fileName"];
          file.forEach((element) => {
            storage.ref(code[0]).child(element.toString()).delete();
          });
          db.ref("space/" + code[0] + "/").remove();
        }
      }
    });
  }
});