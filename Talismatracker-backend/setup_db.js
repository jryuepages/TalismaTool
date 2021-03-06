
var fs = require("fs")
var sqlite3 = require("sqlite3").verbose()


var file = "talisma_tracker.db"
var exists = fs.existsSync(file)


var db = new sqlite3.Database(file)

var talisma_tracker = JSON.parse(fs.readFileSync("talisma_tracker.json", "utf8"))



db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE talisma_tracker (id int, name text, status text, total_days_amount int, contact text, start_date datetime , partial_minutes_amount int)")

    var stmt = db.prepare("INSERT INTO talisma_tracker VALUES (?,?,?,?,?,?,?)")
    for (var k=0; k<talisma_tracker.talisma_tracker.length; ++k) {
      stmt.run(k, talisma_tracker.talisma_tracker[k].name, talisma_tracker.talisma_tracker[k].status, talisma_tracker.talisma_tracker[k].total_days_amount, talisma_tracker.talisma_tracker[k].contact, "", talisma_tracker.talisma_tracker[k].partial_minutes_amount)
    }
  }

  db.each("SELECT * FROM talisma_tracker;",
    function (err, row) {
      console.log(row.id + ": " + row.name + "(status: " + row.status + ", total_days_amount: " + row.total_days_amount + ", contact: " + row.contact + ", start_date: " + row.start_date + ", partial_minutes_amount: " + row.partial_minutes_amount + ")")
    }
  )
})
