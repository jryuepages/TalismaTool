
var fs = require("fs")
var sqlite3 = require("sqlite3").verbose()
var restify = require('restify')


var file = "talisma_tracker.db"
var db = new sqlite3.Database(file)


var server = restify.createServer()
server.use(restify.fullResponse())
server.use(restify.bodyParser({ mapParams: true }))

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    return next()
  }
)



server.get("/talisma_tracker", function(req, res, next) {
  var talisma_tracker = []

  db.serialize(function() {
    db.each("SELECT * FROM talisma_tracker order by total_days_amount ASC;",
      function (err, row) {
        talisma_tracker.push({
          "id": row.id,
          "name": row.name,
          "status": row.status,
          "total_days_amount": row.total_days_amount,
          "contact": row.contact,
          "start_date": row.start_date,
          "partial_minutes_amount": row.partial_minutes_amount
        })
      },
      function (err, cntx) {
        res.json({
          talisma_tracker : talisma_tracker
        })
      }
    )
  })

})



server.get("/talisma_tracker/:name", function(req, res, next) {
  var talisma_tracker_name = {}
  var queryName = req.params.name

  db.serialize(function() {
    db.each("SELECT * FROM talisma_tracker WHERE name = '"+queryName+"';",
      function (err, row) {
        talisma_tracker_name = {
          "id": row.id,
          "name": row.name,
          "status": row.status,
          "total_days_amount": row.total_days_amount,
          "contact": row.contact,
          "start_date": row.start_date,
          "partial_minutes_amount": row.partial_minutes_amount
        }
      },
      function (err, cntx) {
        res.json(talisma_tracker_name)
      }
    )
  })

})




server.put("/talisma_tracker/:id", function(req, res, next) {
  var id = req.params.id
  var talisma_tracker_id = req.body

  var sid = talisma_tracker_id.id
  var name = talisma_tracker_id.name
  var status = talisma_tracker_id.status
  var total_days_amount = talisma_tracker_id.total_days_amount
  var contact = talisma_tracker_id.contact
  var start_date = talisma_tracker_id.start_date
  var partial_minutes_amount = talisma_tracker_id.partial_minutes_amount

  if(sid != 'undefined' && sid == id) {
    if(name != 'undefined' && status != 'undefined' && total_days_amount != 'undefined' && contact != 'undefined') {
      var updateStmt = db.prepare('UPDATE talisma_tracker SET name=(?), status=(?), total_days_amount=(?), contact=(?), start_date=(?), partial_minutes_amount=(?) WHERE id='+id)
      updateStmt.run(name, status, total_days_amount, contact, start_date, partial_minutes_amount, function(err) {
        if (err != null) {
          console.log("Error in updating Talisma Tracker: " + err)
        }
      });
    }
  }
})




var port = 3010
server.listen(port, function (err) {
    if (err) {
        console.error(err)
        return 1
    } else {
        return 0
    }
})
