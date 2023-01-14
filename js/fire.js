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
*/
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage  = firebase.storage();
// remove older files >24hr
db.ref("space").orderByChild('time').once('value', (snap) => {
  var datas= snap.val();
  if(datas){
  const code = Object.keys(datas);
  db.ref("space/"+code[0]).once('value', (snap) => {
    var data = snap.val();
    if(data){
    var sdate = data['date'];
    var cdate = new Date();
    var date = cdate.getDate();
    var mon = cdate.getMonth()+1;
    var year = cdate.getFullYear();
    var today = date+"-"+mon+"-"+year;
    var parts =sdate.split('-');
    var d1 = Number(parts[2] + parts[1] + parts[0]);
    parts = today.split('-');
    var d2 = Number(parts[2] + parts[1] + parts[0]);
    if(d1 < d2){
      var file = data['fileName'];
      file.forEach(element => {
      storage.ref(code[0]).child(element.toString()).delete();
      db.ref("space/"+code[0]+"/").remove();  
      });
    }
    }
  });
}
});

