async function getLichessGames(username: string) {
	const response = await fetch(
	  `https://lichess.org/api/games/user/${username}?max=10&format=json`,
	  {
		headers: {
		  "Accept": "application/json", // Ensures JSON response
		},
	  }
	);
  
	if (!response.ok) {
	  throw new Error(`Failed to fetch games for ${username}`);
	}
  
	const text = await response.text();

	try {
	  const games = text
		.split("\n")
		.filter(Boolean)
		.map((line) => JSON.parse(line));
  
	  return games;
	} catch (error) {
	  console.error("Failed to parse JSON:", error);
	  throw new Error(`Failed to parse JSON for ${username}`);
	}
  }
  
export default async function GameList({ username }: { username: string }) {
	const games = await getLichessGames(username);

	if (!games || games.length === 0) {
		return <p>No games found for {username}.</p>;
	}

	return (
		<main>
			<ul>
				{games.map((game) => (
					<li key={game.id}>
						<a href={game.id} target="_blank" rel="noopener noreferrer">
							{game.players.white.user.name} vs {game.players.black.user.name}
						</a>
					</li>
				))}
			</ul>
		</main>
	);
}