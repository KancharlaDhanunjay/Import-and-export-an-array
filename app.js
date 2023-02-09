const express = require("express");
const cricketApp = express();
cricketApp.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let cricketDb = null;
const path = require("path");

const initializeDbAndServer = async () => {
  try {
    cricketDb = await open({
      filename: path.join(__dirname, "cricketTeam.db"),
      driver: sqlite3.Database,
    });
    cricketApp.listen(3000, () => console.log("Cricket Server Is Started"));
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertObjToRes = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//API_1
cricketApp.get("/players/", async (request, response) => {
  const playersDetails = await cricketDb.all(`SELECT * FROM cricket_team`);
  response.send(
    playersDetails.map((eachPlayer) => ({
      PlayerId: eachPlayer.player_id,
      playerName: eachPlayer.player_name,
      jerseyNumber: eachPlayer.jersey_number,
      role: eachPlayer.role,
    }))
  );
});

//API_2
cricketApp.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayer = `INSERT INTO cricket_team (player_name, jersey_number, role) Values ("Vishal", 17, "Bowler")`;
  await cricketDb.run(postPlayer);
  response.send("Player Added to Team");
});

//API_3
cricketApp.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = await cricketDb.get(
    `SELECT * FROM cricket_team WHERE player_id = ${playerId};`
  );
  response.send(convertObjToRes(getPlayer));
});

//API_4
cricketApp.put("/players/:playerId/", async (request, response) => {
  const { playerId, playerName, jerseyNumber, role } = request.params;
  const updatePlayer = await cricketDb.run(
    `UPDATE cricket_team SET player_name = "Maneesh", jersey_number = 54, role = "All-rounder" WHERE player_id = ${playerId};`
  );
  response.send("Player Details Updated");
});

//API_5
cricketApp.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatePlayer = await cricketDb.run(
    `DELETE FROM cricket_team WHERE player_id = ${playerId};`
  );
  response.send("Player Removed");
});

module.exports = cricketApp;
