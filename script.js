/* Global variables, Objective: Store crucial data that will be accessed and modified by different functions throughout the system. */

let selectedTeams = [];
let matchResults = {};
let bracketData = {};
let pointsMultiplier = 10;

/* Tournament configurations */

/* Array of strings with all available team names. */
const allTeams = [
    "Arsenal", "Aston Villa", "AFC Bournemouth", "Brentford", "Brighton & Hove Albion", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town", "Leicester City", "Liverpool", "Manchester City", "Manchester United", "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur", "West Ham United", "Wolverhampton Wanderers"
];

/* Tournament Configuration Structure */
const tournamentConfigs = {
    "16teams": {
        totalTeams: 16,
        rounds: ["Oitavas de Final", "Quartas de Final", "Semifinal", "Final"],
        matchesPerRound: [8, 4, 2, 1]
    },
    "8teams": {
        totalTeams: 8,
        rounds: ["Quartas de Final", "Semifinal", "Final"],
        matchesPerRound: [4, 2, 1]
    },
    "4teams": {
        totalTeams: 4,
        rounds: ["Semifinal", "Final"],
        matchesPerRound: [2, 1]
    }
};

// Function to show custom alert popup
function showCustomAlert(message) {
    const customAlert = document.getElementById('customAlert');
    const customAlertMessage = document.getElementById('customAlertMessage');
    const customAlertCloseBtn = customAlert.querySelector('.custom-alert-close-btn');
    const customAlertOkBtn = customAlert.querySelector('.custom-alert-ok-btn');

    customAlertMessage.textContent = message;
    customAlert.classList.add('show');

    const hideAlert = () => {
        customAlert.classList.remove('show');
        customAlertCloseBtn.removeEventListener('click', hideAlert);
        customAlertOkBtn.removeEventListener('click', hideAlert);
    };

    customAlertCloseBtn.addEventListener('click', hideAlert);
    customAlertOkBtn.addEventListener('click', hideAlert);
}


function updateTournamentInfo() {
    const tournamentSelect = document.getElementById('tournamentSelect');
    const tournamentType = tournamentSelect.value;

    const infoSection = document.getElementById('tournamentInfo');
    const teamSelectionSection = document.getElementById('teamSelectionSection');
    const maxTeamsSpan = document.getElementById('maxTeams');
    const generateBtn = document.getElementById('generateBtn');

    if (tournamentType === "") {
        infoSection.style.display = 'none';
        teamSelectionSection.style.display = 'none';
        document.getElementById('bracketSection').style.display = 'none';
        document.getElementById('championSection').style.display = 'none';
        document.getElementById('pointsSection').style.display = 'none';

        generateBtn.disabled = true;
        document.getElementById('simulateBtn').disabled = true;

        document.getElementById('totalTeams').textContent = '0';
        document.getElementById('totalRounds').textContent = '0';
        document.getElementById('totalMatches').textContent = '0';
        document.getElementById('championTeam').textContent = 'Pendente';
        document.getElementById('selectedCount').textContent = '0';
        document.getElementById('teamGrid').innerHTML = '';

        selectedTeams = [];
        bracketData = {};

        return;
    }

    const config = tournamentConfigs[tournamentType];
    if (!config) {
        console.error("Configuração de torneio não encontrada para:", tournamentType);
        return;
    }

    // Atualiza os elementos na seção 'tournament-info' com base na configuração
    document.getElementById('totalTeams').textContent = config.totalTeams;
    document.getElementById('totalRounds').textContent = config.rounds.length;
    document.getElementById('totalMatches').textContent = config.totalTeams - 1;
    document.getElementById('championTeam').textContent = 'Pendente';

    infoSection.style.display = 'block';
    maxTeamsSpan.textContent = config.totalTeams;
    teamSelectionSection.style.display = 'block';

    // Reseta e preenche o grid de times para a nova seleção
    selectedTeams = [];
    document.getElementById('selectedCount').textContent = selectedTeams.length;
    generateBtn.disabled = true;
    document.getElementById('simulateBtn').disabled = true;

    populateTeamGrid(config.totalTeams);
}

function selectTeam(teamName, element, maxTeamsToSelect) {
    const generateBtn = document.getElementById('generateBtn');
    const selectedCountSpan = document.getElementById('selectedCount');

    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedTeams = selectedTeams.filter(team => team !== teamName);
    } else {
        if (selectedTeams.length < maxTeamsToSelect) {
            element.classList.add('selected');
            selectedTeams.push(teamName);
        } else {
            // Substituído alert por popup customizado
            showCustomAlert(`Você já selecionou o máximo de ${maxTeamsToSelect} times para este torneio.`);
        }
    }
    document.getElementById('selectedCount').textContent = selectedTeams.length;

    // Habilita o botão Gerar Chaveamento se o número de times estiver correto
    if (selectedTeams.length === maxTeamsToSelect) {
        generateBtn.disabled = false;
    } else {
        generateBtn.disabled = true;
    }
}

function populateTeamGrid(maxTeamsToSelect) {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';

    allTeams.forEach(team => {
        const teamSlot = document.createElement('div');
        teamSlot.classList.add('team-slot');
        teamSlot.textContent = team;
        teamSlot.onclick = () => selectTeam(team, teamSlot, maxTeamsToSelect);
        teamGrid.appendChild(teamSlot);
    });
}

function renderPointsTable(teamPoints) {
    const pointsTableBody = document.getElementById('pointsTableBody');
    pointsTableBody.innerHTML = '';

    // Converte o objeto em array e ordena por pontos
    const sortedTeams = Object.entries(teamPoints).sort(([, a], [, b]) => b.points - a.points);

    sortedTeams.forEach(([teamName, data], index) => {
        const row = pointsTableBody.insertRow();
        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = teamName;
        row.insertCell().textContent = data.wins;
        row.insertCell().textContent = data.faseReached;
        row.insertCell().textContent = data.points;
    });

    document.getElementById('pointsSection').style.display = 'block';
}

function resetTournament() {
    resetTournamentData();

    // Esconde e limpa as seções
    document.getElementById('tournamentInfo').style.display = 'none';
    document.getElementById('teamSelectionSection').style.display = 'none';
    document.getElementById('bracketSection').style.display = 'none';
    document.getElementById('championSection').style.display = 'none';
    document.getElementById('pointsSection').style.display = 'none';

    document.getElementById('bracket').innerHTML = '';
    document.getElementById('pointsTableBody').innerHTML = '';

    // Reseta selects e botões
    document.getElementById('tournamentSelect').value = "";
    document.getElementById('pointsPerWin').value = "10";
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('simulateBtn').disabled = true;

    // Atualiza contadores para 0
    document.getElementById('totalTeams').textContent = '0';
    document.getElementById('totalRounds').textContent = '0';
    document.getElementById('totalMatches').textContent = '0';
    document.getElementById('championTeam').textContent = 'Pendente';
    document.getElementById('selectedCount').textContent = '0';

    // Garante que a seção de seleção de times esteja pronta para nova interação
    document.getElementById('teamGrid').innerHTML = '';
}

// Função auxiliar para resetar apenas os dados internos do torneio
function resetTournamentData() {
    bracketData = {};
    selectedTeams = [];
    matchResults = {};
    document.getElementById('championName').textContent = 'Time Vencedor';
    document.getElementById('championTeam').textContent = 'Pendente';
}

function generateBracket() {
    const tournamentType = document.getElementById('tournamentSelect').value;
    const config = tournamentConfigs[tournamentType];

    if (!config || selectedTeams.length !== config.totalTeams) {
        // Substituído alert por popup customizado
        showCustomAlert(`Por favor, selecione exatamente ${config.totalTeams} times para gerar o chaveamento.`);
        return;
    }

    // Removed resetTournamentData() call from here as it was causing selectedTeams to be emptied.
    bracketData = {};
    const shuffledTeams = shuffleArray([...selectedTeams]);
    let currentRoundTeams = [...shuffledTeams];
    bracketData[config.rounds[0]] = [];
    console.log(bracketData); // For debugging

    for (let i = 0; i < config.matchesPerRound[0]; i++) {
        const team1 = currentRoundTeams.shift();
        const team2 = currentRoundTeams.shift();
        bracketData[config.rounds[0]].push({
            id: `match-${0}-${i}`,
            team1: team1,
            team2: team2,
            score1: 0,
            score2: 0,
            winner: null,
            nextMatchId: null
        });
    }

    for (let r = 1; r < config.rounds.length; r++) {
        bracketData[config.rounds[r]] = [];
    }

    // Link subsequent matches (structure the bracket)
    for (let r = 0; r < config.rounds.length - 1; r++) {
        const currentRoundName = config.rounds[r]; // Define currentRoundName
        const nextRoundName = config.rounds[r + 1]; // Use nextRoundName for clarity
        let nextMatchIndex = 0;

        for (let i = 0; i < bracketData[currentRoundName].length; i++) {
            const match = bracketData[currentRoundName][i];

            // Every two matches, they feed into a next match
            if (i % 2 === 0) {
                if (!bracketData[nextRoundName][nextMatchIndex]) {
                    bracketData[nextRoundName][nextMatchIndex] = {
                        id: `match-${r + 1}-${nextMatchIndex}`,
                        team1: null,
                        team2: null,
                        score1: 0,
                        score2: 0,
                        winner: null,
                        nextMatchId: (r + 1 < config.rounds.length - 1) ? `match-${r + 2}-${Math.floor(nextMatchIndex / 2)}` : null
                    };
                }
                match.nextMatchId = `match-${r + 1}-${nextMatchIndex}`;
            } else {
                match.nextMatchId = `match-${r + 1}-${nextMatchIndex}`;
                nextMatchIndex++;
            }
        }
    }

    renderBracket(config);
    document.getElementById('bracketSection').style.display = 'block';
    document.getElementById('simulateBtn').disabled = false;
    document.getElementById('teamSelectionSection').style.display = 'none';
}

function renderBracket(config) {
    const bracketDiv = document.getElementById('bracket');
    bracketDiv.innerHTML = '';
    console.log(config); // For debugging
    console.log(bracketData); // For debugging

    config.rounds.forEach((roundName, roundIndex) => {
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');
        roundDiv.id = `round-${roundIndex}`;

        const roundTitle = document.createElement('h4');
        roundTitle.textContent = roundName;
        roundDiv.appendChild(roundTitle);

        bracketData[roundName].forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            matchDiv.id = match.id;

            const team1Div = document.createElement('div');
            team1Div.classList.add('team');
            team1Div.innerHTML = `<span class="team-name">${match.team1 || 'Aguardando...'}</span><span class="team-score">${match.score1 !== null ? match.score1 : '-'}</span>`;
            matchDiv.appendChild(team1Div);

            const vsDiv = document.createElement('div');
            vsDiv.classList.add('match-vs');
            vsDiv.textContent = 'VS';
            matchDiv.appendChild(vsDiv);

            const team2Div = document.createElement('div');
            team2Div.classList.add('team');
            team2Div.innerHTML = `<span class="team-name">${match.team2 || 'Aguardando...'}</span><span class="team-score">${match.score2 !== null ? match.score2 : '-'}</span>`;
            matchDiv.appendChild(team2Div);

            if (match.winner) {
                matchDiv.classList.add('completed');
                if (match.winner === match.team1) {
                    team1Div.classList.add('winner');
                    team2Div.classList.add('loser');
                } else {
                    team2Div.classList.add('winner');
                    team1Div.classList.add('loser');
                }
            } else if (!match.team1 || !match.team2) {
                matchDiv.classList.add('empty-slot');
            }

            matchDiv.onclick = () => manuallySetScore(match.id);
            roundDiv.appendChild(matchDiv);
        });
        bracketDiv.appendChild(roundDiv);
    });
}

function getWinner(score1, score2, team1, team2) {
    if (score1 > score2) return team1;
    if (score2 > score1) return team2;

    return Math.random() > 0.5 ? team1 : team2;
}

function generateRandomScore() {
    return Math.floor(Math.random() * 5);
}

function simulateMatch() {
    const tournamentType = document.getElementById('tournamentSelect').value;
    const config = tournamentConfigs[tournamentType];
    let nextMatchFound = false;

    for (let r = 0; r < config.rounds.length; r++) {
        const roundName = config.rounds[r];
        for (let i = 0; i < bracketData[roundName].length; i++) {
            const match = bracketData[roundName][i];

            if (match.team1 && match.team2 && !match.winner) {
                match.score1 = generateRandomScore();
                match.score2 = generateRandomScore();
                match.winner = getWinner(match.score1, match.score2, match.team1, match.team2);

                updateMatchUI(match);

                // Advance the winner to the next phase
                if (match.nextMatchId) {
                    const [nextRoundIndex, nextMatchIndex] = match.nextMatchId.split('-').slice(1).map(Number);
                    const nextRoundName = config.rounds[nextRoundIndex];
                    const nextMatch = bracketData[nextRoundName][nextMatchIndex];

                    if (!nextMatch) {
                        console.error("Próxima partida não encontrada:", match.nextMatchId);
                        return;
                    }

                    if (match.id.endsWith('0') || match.id.endsWith('2') || match.id.endsWith('4') || match.id.endsWith('6')) { // Primeiro time do par
                        nextMatch.team1 = match.winner;
                    } else { // Segundo time do par
                        nextMatch.team2 = match.winner;
                    }

                    updateMatchUI(nextMatch);
                } else {
                    document.getElementById('championName').textContent = match.winner;
                    document.getElementById('championSection').style.display = 'block';
                    document.getElementById('simulateBtn').disabled = true;
                }

                calculateAllPoints();
                nextMatchFound = true;
                return;
            }
        }
    }

    if (!nextMatchFound) {
        // Substituído alert por popup customizado
        showCustomAlert("Todas as partidas foram simuladas! O torneio terminou.");
        document.getElementById('simulateBtn').disabled = true;
    }
}

function updateMatchUI(match) {
    const matchDiv = document.getElementById(match.id);
    if (!matchDiv) return;

    const team1Div = matchDiv.querySelector('.team:first-child');
    const team2Div = matchDiv.querySelector('.team:last-child');

    team1Div.querySelector('.team-name').textContent = match.team1 || 'Aguardando...';
    team1Div.querySelector('.team-score').textContent = match.score1 !== null ? match.score1 : '-';

    team2Div.querySelector('.team-name').textContent = match.team2 || 'Aguardando...';
    team2Div.querySelector('.team-score').textContent = match.score2 !== null ? match.score2 : '-';


    if (match.winner) {
        matchDiv.classList.add('completed');
        if (match.winner === match.team1) {
            team1Div.classList.add('winner');
            team2Div.classList.add('loser');
        } else {
            team2Div.classList.add('winner');
            team1Div.classList.add('loser');
        }
    } else if (!match.team1 || !match.team2) {
        matchDiv.classList.add('empty-slot');
    }
}

function manuallySetScore(matchId) {
    const [roundIndex, matchIndex] = matchId.split('-').slice(1).map(Number);
    const tournamentType = document.getElementById('tournamentSelect').value;
    const config = tournamentConfigs[tournamentType];
    const roundName = config.rounds[roundIndex];
    const match = bracketData[roundName][matchIndex];

    if (!match || !match.team1 || !match.team2 || match.winner) {
        return;
    }

    // Use custom prompt-like behavior or a custom modal for input if needed
    // Por enquanto, mantendo prompt, pois é para entrada de dados, não apenas alerta.
    let score1 = prompt(`Digite o placar para ${match.team1}:`);
    let score2 = prompt(`Digite o placar para ${match.team2}:`);

    score1 = parseInt(score1);
    score2 = parseInt(score2);

    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
        // Substituído alert por popup customizado
        showCustomAlert("Placares inválidos. Por favor, insira números não negativos.");
        return;
    }

    match.score1 = score1;
    match.score2 = score2;
    match.winner = getWinner(score1, score2, match.team1, match.team2);

    updateMatchUI(match);

    // Logic to advance the winner to the next phase (copy from simulateMatch)
    if (match.nextMatchId) {
        const [nextRoundIndex, nextMatchIndex] = match.nextMatchId.split('-').slice(1).map(Number);
        const nextRoundName = config.rounds[nextRoundIndex];
        const nextMatch = bracketData[nextRoundName][nextMatchIndex];

        if (!nextMatch) {
            console.error("Próxima partida não encontrada:", match.nextMatchId);
            return;
        }

        if (match.id.endsWith('0') || match.id.endsWith('2') || match.id.endsWith('4') || match.id.endsWith('6')) {
            nextMatch.team1 = match.winner;
        } else {
            nextMatch.team2 = match.winner;
        }
        updateMatchUI(nextMatch);
    } else {
        document.getElementById('championName').textContent = match.winner;
        document.getElementById('championSection').style.display = 'block';
        document.getElementById('simulateBtn').disabled = true;
    }

    calculateAllPoints();
}

function calculateAllPoints() {
    pointsMultiplier = parseInt(document.getElementById('pointsPerWin').value);
    const tournamentType = document.getElementById('tournamentSelect').value;
    const config = tournamentConfigs[tournamentType];

    // ✅ CORREÇÃO: Adicionando verificação para 'config' ser definido
    // Se a configuração do torneio não foi carregada (dropdown vazio),
    // não há dados para calcular pontos, então a função retorna.
    if (!config) {
        return;
    }

    const teamPoints = {};
    selectedTeams.forEach(team => {
        teamPoints[team] = {
            wins: 0,
            faseReached: "Não Participou",
            points: 0
        };
    });

    // Calculate wins and phase reached
    for (let r = 0; r < config.rounds.length; r++) {
        const roundName = config.rounds[r];
        // ✅ CORREÇÃO: Adicionando verificação para 'bracketData[roundName]' ser definido
        if (bracketData[roundName]) { // Garante que a rodada existe no bracketData
            bracketData[roundName].forEach(match => {
                if (match.winner) {
                    // Add win to winner
                    if (teamPoints[match.winner]) {
                        teamPoints[match.winner].wins++;
                    }

                    // Define phase reached for the winner
                    if (teamPoints[match.winner] && r < config.rounds.length) {
                        teamPoints[match.winner].faseReached = roundName;
                    }

                    // Define phase reached for the loser
                    const loser = (match.winner === match.team1) ? match.team2 : match.team1;
                    if (teamPoints[loser]) {
                        teamPoints[loser].faseReached = roundName;
                    }
                }
            });
        }
    }
    // Calculate final points based on wins and phase reached
    for (const teamName in teamPoints) {
        const teamData = teamPoints[teamName];
        teamData.points = teamData.wins * pointsMultiplier;

        // Add extra points for phase reached (e.g., semifinalist, finalist, champion)
        const roundNames = config.rounds;
        if (teamData.faseReached === roundNames[roundNames.length - 1] && teamPoints[teamName].wins > 0) {
            teamData.points += pointsMultiplier * 2;
            document.getElementById('championTeam').textContent = teamName;
        } else if (roundNames.length >= 2 && teamData.faseReached === roundNames[roundNames.length - 2]) {
            teamData.points += pointsMultiplier;
        } else if (roundNames.length >= 3 && teamData.faseReached === roundNames[roundNames.length - 3]) {

        }
    }
    renderPointsTable(teamPoints);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tournamentSelect').addEventListener('change', updateTournamentInfo);
    document.getElementById('pointsPerWin').addEventListener('change', calculateAllPoints);
    document.getElementById('generateBtn').addEventListener('click', generateBracket);
    document.getElementById('simulateBtn').addEventListener('click', simulateMatch);
    document.getElementById('resetBtn').addEventListener('click', resetTournament);

    updateTournamentInfo();
});
