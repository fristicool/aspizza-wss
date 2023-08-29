const WebSocket = require('ws')
let PORT = process.env.PORT || 8080
const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log('server started')
})


let duo = [];
let groep = [];

wss.on('connection', function connection(ws) {
    ws.send("You are the new connection")
    ws.on('message', (data) => {
        console.log('data received \n %o', data.toString())

        const parts = data.toString().split(':')
        switch (parts[0]) {
            case 'CreateTeam':

                const team = {
                    name: parts[2],
                    score: parseInt(parts[3])
                };

                if (parts[1] === "2") {
                    duo.push(team);
                } else if (parts[1] === "10") {
                    groep.push(team);
                }

                break;

            case "GetTeams":

                if (parts[1] == "2") {

                    const teamsData = duo

                    ws.send(`Teams*${JSON.stringify(teamsData)}`)
                } else {
                    if (parts[1] == "10") {
                        const teamsData = groep

                        ws.send(`Teams*${JSON.stringify(teamsData)}`)
                    }
                }

                break;
            case "AddPoints":

                if (parts[1] == "2") {
                    const teamIndex = getTeamByName(parts[2], "2")
                    duo[teamIndex].score = duo[teamIndex].score + parseInt(parts[3])
                } else {
                    if (parts[1] == "10") {
                        const teamIndex = getTeamByName(parts[2], "10")
                        groep[teamIndex].score = groep[teamIndex].score + parseInt(parts[3])
                    }
                }

                break;

            case "Reset":

                duo = [];
                groep = [];

                break;

            default:
                break;
        }

        wss.broadcast(data.toString());
    })
})

function getTeamByName(teamName, board) {
    if (board == "2") {
        for (let i = 0; i < duo.length; i++) {
            const team = duo[i];

            if (team.name == teamName) {
                return i
            }

        }
    }
    if (board == "10") {
        for (let i = 0; i < groep.length; i++) {
            const team = groep[i];

            if (team.name == teamName) {
                return i
            }

        }
    }

    return 0;
}

wss.on('listening', () => {
    console.log('listening on ' + PORT)
})

wss.broadcast = function broadcast(msg) {
    console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};