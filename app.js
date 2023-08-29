const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "covid19India.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

module.exports = app;

//API 1
app.get("/states/", async (request, response) => {
  const getStatesQuery = `
    SELECT
      *
    FROM
      state
    `;
  const statesArray = await db.all(getStatesQuery);
  response.send(statesArray);
});

//API 2
app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateQuery = `select * from state where state_id = ${stateId};`;
  const getState = await db.get(getStateQuery);
  response.send(getState);
});

//API 3
app.post("/districts/", async (request, response) => {
  const { stateId, districtName, cases, cured, active, deaths } = request.body;
  const addDistrictQuery = `insert into district(state_id, district_name, cases, cured, active, deaths)
  values('${stateId}','${districtName}','${cases}','${cured}','${active}','${deaths}');
  `;
  await db.run(addDistrictQuery);
  response.send("District Successfully Added");
});
