---
layout: page_withupdate
title: How To
subtitle: A guide to everything I've tried to do
---


# Intro
The first thing you need when wanting to look at NHL data is NHL data.  Unfortunately there isn't too much documentation, but there is an API and resources (like [https://github.com/Zmalski/NHL-API-Reference](https://github.com/Zmalski/NHL-API-Reference)) which help along the way.

The main things I wanted to achieve was a table with all actions.  For every shot, hit, goal etc. I wanted a table with all of the possible informatiion.  This could then be supplemented with standings information, roster information etc.

# Set Up
There are many different ways to do this.  My preference is to run python script in JupyterLab within Anaconda:
![AnacondaScreenshot](/assets/img/AnacondaScreenshot.png){: .mx-auto.d-block :}

You can then open a notebook:
![AnacondaScreenshot2](/assets/img/AnacondaScreenshot2.png){: .mx-auto.d-block :}

# The Code

## Set Up
First, we need to import some libraries:

```python
import requests
import pandas as pd
import datetime as dt
from datetime import datetime, timedelta
import json
import os
```

In the next cell, I like to create my variables.  The two I need are one for if we choose to run this code on 1 season only (one_season_sel) and another if we wish to run the code on multiple seasons, specify the first (from_season_sel).  Where these are used will become clear later:

```python
one_season_sel = 20202021
from_season_sel = 20122013
```


## Team Information
The first element I pulled was the team information in the NHL API:

```python
# Make HTTP request to NHL API
team_url = "https://api.nhle.com/stats/rest/en/team"
team_response = requests.get(team_url)

# Convert response to dictionary
team_data = team_response.json()

# Extract team data
team_data_extract = team_data['data']

# Create empty list to store team data
team_list = []

# Loop through teams and extract data
for team in team_data_extract:
    team_dict = {}
    team_dict['id'] = team['id']
    team_dict['franchiseId'] = team['franchiseId']
    team_dict['fullName'] = team['fullName']
    team_dict['leagueId'] = team['leagueId']
    team_dict['rawTricode'] = team['rawTricode']
    team_dict['triCode'] = team['triCode']
    team_list.append(team_dict)

# Create DataFrame for team data
team_df = pd.DataFrame(team_list)

team_df = team_df.replace(',', '', regex=True)
```

There are other elements to the team information we could pull, however these are live/updated metrics which I may need to calculate myself on different time periods, rather than just seeing the latest information.  If you want this, add the variables to the "for team in team_data_extract" loop in the code above.
Possible variables include:

| summary | faceoffpercentages | daysbetweengames | faceoffwins | goalsagainstbystrength | 
| goalsbyperiod | goalsforbystrength | leadingtrailing | realtime | outshootoutshotby | 
| penalties | penaltykill | penaltykilltime | powerplay | powerplaytime | 
| summaryshooting | percentages | scoretrailfirst | shootout | shottype | 
| goalgames |  |  |  |  | 



## Roster Information
To pull all teams roster information, we need a list of the team codes:

```python
df_teamcodes = team_df[['triCode']]

# Initialize an empty list to store data
df_rosterseasons = []

# Loop through team codes and retrieve roster data
for index, row in df_teamcodes.iterrows():
    tri_code = row['triCode']
    roster_url = "https://api-web.nhle.com/v1/roster-season/" + tri_code
    
    # Make HTTP request to NHL API for team data
    response = requests.get(roster_url)
    roster_data = response.json()
    
    # Append data for each team to the list
    for season in roster_data:
        df_rosterseasons.append({'triCode': tri_code, 'season': season})

# Create a DataFrame from the collected data
df_rosterseasons_forloop = pd.DataFrame(df_rosterseasons)

# Limit seasons run here
df_rosterseasons_forloop = df_rosterseasons_forloop[(df_rosterseasons_forloop['season'] >= from_season_sel)]
```

You will notice the final line here is where we can limit which seasons we run this data for.

We can then pull the roster data for these seasons:
```python
# Initialize empty lists to store player data
forward_data = []
defensemen_data = []
goalies_data = []

# Loop through each row in the DataFrame
for index, row in df_rosterseasons_forloop.iterrows():
    tri_code = row['triCode']
    season = row['season']

    # Make HTTP request to NHL API for team data
    roster_url = f"https://api-web.nhle.com/v1/roster/{tri_code}/{season}"
    response = requests.get(roster_url)

    # Convert response to dictionary
    roster_data = response.json()

    # Loop through forwards and extract relevant information
    for forward in roster_data['forwards']:
        forward_info = {
            'triCode': tri_code,
            'season': season,
            'playerID': forward['id'],
            'player_name': forward['firstName']['default'] + ' ' + forward['lastName']['default'],
            'sweater_number': forward.get('sweaterNumber', 'N/A'),
            'position': forward['positionCode'],
            'shoots_catches': forward['shootsCatches'],
            'height_cm': forward['heightInCentimeters'],
            'weight_kg': forward['weightInKilograms'],
            'height_in': forward['heightInInches'],
            'weight_lbs': forward['weightInPounds'],
            'birth_date': forward['birthDate'],
            'birth_city': forward['birthCity']['default'],
            'birth_country': forward['birthCountry'],
            'headshot_url': forward['headshot']
        }
        forward_data.append(forward_info)

    # Loop through defence and extract relevant information
    for defensemen in roster_data['defensemen']:
        defensemen_info = {
            'triCode': tri_code,
            'season': season,
            'playerID': defensemen['id'],
            'player_name': defensemen['firstName']['default'] + ' ' + defensemen['lastName']['default'],
            'sweater_number': defensemen.get('sweaterNumber', 'N/A'),
            'position': defensemen['positionCode'],
            'shoots_catches': defensemen['shootsCatches'],
            'height_cm': defensemen['heightInCentimeters'],
            'weight_kg': defensemen['weightInKilograms'],
            'height_in': defensemen['heightInInches'],
            'weight_lbs': defensemen['weightInPounds'],
            'birth_date': defensemen['birthDate'],
            'birth_city': defensemen['birthCity']['default'],
            'birth_country': defensemen['birthCountry'],
            'headshot_url': defensemen['headshot']
        }
        defensemen_data.append(defensemen_info)

    # Loop through goalies and extract relevant information
    for goalies in roster_data['goalies']:
        goalies_info = {
            'triCode': tri_code,
            'season': season,
            'playerID': goalies['id'],
            'player_name': goalies['firstName']['default'] + ' ' + goalies['lastName']['default'],
            'sweater_number': goalies.get('sweaterNumber', 'N/A'),
            'position': goalies['positionCode'],
            'shoots_catches': goalies['shootsCatches'],
            'height_cm': goalies['heightInCentimeters'],
            'weight_kg': goalies['weightInKilograms'],
            'height_in': goalies['heightInInches'],
            'weight_lbs': goalies['weightInPounds'],
            'birth_date': goalies['birthDate'],
            'birth_city': goalies['birthCity']['default'],
            'birth_country': goalies['birthCountry'],
            'headshot_url': goalies['headshot']
        }
        goalies_data.append(goalies_info)
        
# Create a DataFrame for forwards
df_forwards = pd.DataFrame(forward_data)
df_defence = pd.DataFrame(defensemen_data)
df_goalies = pd.DataFrame(goalies_data)

# Union all of the data together
df_roster = pd.concat([df_forwards, df_defence, df_goalies], ignore_index=True)
```

## Schedule Information
The next data we can pull is the schedule information, to know which team is playing who on each gameID:

```python
# Initialize an empty list to store dictionaries for each game
games_data = []

# Loop through each row in the DataFrame
for index, row in df_rosterseasons_forloop.iterrows():
    tri_code = row['triCode']
    season = row['season']

    # Make HTTP request to NHL API for team data
    schedule_url = f"https://api-web.nhle.com/v1/club-schedule-season/{tri_code}/{season}"
    response = requests.get(schedule_url)

    # Convert response to dictionary
    schedule_data = response.json()
    games = schedule_data.get('games', [])

    # Loop through each game and extract all columns
    for game in games:
        game_dict = {
            'id': game.get('id'),
            'season': game.get('season'),
            'gameType': game.get('gameType'),
            'gameDate': game.get('gameDate'),
            'venue': game['venue'].get('default'),
            'neutralSite': game.get('neutralSite'),
            'startTimeUTC': game.get('startTimeUTC'),
            'easternUTCOffset': game.get('easternUTCOffset'),
            'venueUTCOffset': game.get('venueUTCOffset'),
            'venueTimezone': game.get('venueTimezone'),
            'gameState': game.get('gameState'),
            'gameScheduleState': game.get('gameScheduleState'),
            #'tvBroadcasts': game.get('tvBroadcasts'),
            'awayTeamID': game['awayTeam'].get('id'),
            'awayTeamPlaceName': game['awayTeam']['placeName'].get('default'),
            'awayTeamAbbrev': game['awayTeam'].get('abbrev'),
            'awayTeamLogo': game['awayTeam'].get('logo'),
            'awayTeamScore': game['awayTeam'].get('score'),
            'homeTeamID': game['homeTeam'].get('id'),
            'homeTeamPlaceName': game['homeTeam']['placeName'].get('default'),
            'homeTeamAbbrev': game['homeTeam'].get('abbrev'),
            'homeTeamLogo': game['homeTeam'].get('logo'),
            'homeTeamScore': game['homeTeam'].get('score'),
            'periodType': game.get('periodDescriptor', {}).get('periodType'),
            'lastPeriodType': game.get('gameOutcome', {}).get('lastPeriodType'),
            'gameCenterLink': game.get('gameCenterLink'),
            'winningGoalieID': game.get('winningGoalie', {}).get('playerId', 'n/a'),
            'winningGoalie': game.get('winningGoalie', {}).get('lastName', {}).get('default', 'n/a'),
            'winningGoalScorerID': game.get('winningGoalScorer', {}).get('playerId', 'n/a'),
            'winningGoalScorer': game.get('winningGoalScorer', {}).get('lastName', {}).get('default', 'n/a'),
        }
        games_data.append(game_dict)    

# Create DataFrame from the list of dictionaries
df_games = pd.DataFrame(games_data)

df_games['gameTypeDesc'] = df_games['gameType'].apply(lambda x: 'Preseason' if x == 1 else ('Regular' if x == 2 else ('Playoffs' if x == 3 else 'Unknown')))
df_games = df_games.drop_duplicates()
```

## Standings Information
The next dataset we can pull is the standings data for every day.

First, we need to limit the days which we pull this data for.  I chose to do this one season at a time:

```python
# Get list of dates
# Extracting the year portion from season_sel
year = int(str(one_season_sel)[:4])  # Assuming the format is consistent
# Creating start_date and end_date strings based on the extracted year
start_date = f"09-01-{year - 1}"
end_date = f"08-01-{year}"

# Generate a list of dates between start_date and end_date
date_list = pd.date_range(start=start_date, end=end_date)
# Create a DataFrame with the list of dates
df_dts = pd.DataFrame(date_list, columns=['Date'])

df_dts['Date'] = df_dts['Date'].astype(str)
```

You can then use this list of dates to create the standings for each day:

```python
# Initialize an empty list to store standings data
standings_data_list = []

# Loop through each row in the DataFrame
for index, row in df_dts.iterrows():
    Date = row['Date']

    # Make HTTP request to NHL API for team data
    standings_url = f"https://api-web.nhle.com/v1/standings/{Date}"
    response = requests.get(standings_url)
    
    standings_data = response.json()
    
    # Extracting the 'standings' data
    standings_list = standings_data.get('standings', [])
    
    # Initialize an empty list to store extracted columns
    extracted_columns = []

    # Loop through each team's standing information
    for team_info in standings_list:
        extracted_info = {
            'conferenceAbbrev': team_info.get('conferenceAbbrev'),
            'conferenceName': team_info.get('conferenceName'),
            'placeName_default': team_info.get('placeName', {}).get('default'),
            'date': team_info.get('date'),
            'divisionAbbrev': team_info.get('divisionAbbrev'),
            'gamesPlayed': team_info.get('gamesPlayed'),
            'goalDifferential': team_info.get('goalDifferential'),
            'goalDifferentialPctg': team_info.get('goalDifferentialPctg'),
            'goalAgainst': team_info.get('goalAgainst'),
            'goalFor': team_info.get('goalFor'),
            'goalsForPctg': team_info.get('goalsForPctg'),
            'homeGamesPlayed': team_info.get('homeGamesPlayed'),
            'homeGoalDifferential': team_info.get('homeGoalDifferential'),
            'homeGoalsAgainst': team_info.get('homeGoalsAgainst'),
            'homeGoalsFor': team_info.get('homeGoalsFor'),
            'homeLosses': team_info.get('homeLosses'),
            'homeOtLosses': team_info.get('homeOtLosses'),
            'homePoints': team_info.get('homePoints'),
            'homeRegulationPlusOtWins': team_info.get('homeRegulationPlusOtWins'),
            'homeRegulationWins': team_info.get('homeRegulationWins'),
            'homeTies': team_info.get('homeTies'),
            'homeWins': team_info.get('homeWins'),
            'l10GamesPlayed': team_info.get('l10GamesPlayed'),
            'l10GoalDifferential': team_info.get('l10GoalDifferential'),
            'l10GoalsAgainst': team_info.get('l10GoalsAgainst'),
            'l10GoalsFor': team_info.get('l10GoalsFor'),
            'l10Losses': team_info.get('l10Losses'),
            'l10OtLosses': team_info.get('l10OtLosses'),
            'l10Points': team_info.get('l10Points'),
            'l10RegulationPlusOtWins': team_info.get('l10RegulationPlusOtWins'),
            'l10RegulationWins': team_info.get('l10RegulationWins'),
            'l10Ties': team_info.get('l10Ties'),
            'l10Wins': team_info.get('l10Wins'),
            'leagueHomeSequence': team_info.get('leagueHomeSequence'),
            'leagueL10Sequence': team_info.get('leagueL10Sequence'),
            'leagueRoadSequence': team_info.get('leagueRoadSequence'),
            'leagueSequence': team_info.get('leagueSequence'),
            'losses': team_info.get('losses'),
            'otLosses': team_info.get('otLosses'),
            'placeName_default': team_info.get('placeName', {}).get('default'),
            'pointPctg': team_info.get('pointPctg'),
            'points': team_info.get('points'),
            'regulationPlusOtWinPctg': team_info.get('regulationPlusOtWinPctg'),
            'regulationPlusOtWins': team_info.get('regulationPlusOtWins'),
            'regulationWinPctg': team_info.get('regulationWinPctg'),
            'regulationWins': team_info.get('regulationWins'),
            'roadGamesPlayed': team_info.get('roadGamesPlayed'),
            'roadGoalDifferential': team_info.get('roadGoalDifferential'),
            'roadGoalsAgainst': team_info.get('roadGoalsAgainst'),
            'roadGoalsFor': team_info.get('roadGoalsFor'),
            'roadLosses': team_info.get('roadLosses'),
            'roadOtLosses': team_info.get('roadOtLosses'),
            'roadPoints': team_info.get('roadPoints'),
            'roadRegulationPlusOtWins': team_info.get('roadRegulationPlusOtWins'),
            'roadRegulationWins': team_info.get('roadRegulationWins'),
            'roadTies': team_info.get('roadTies'),
            'roadWins': team_info.get('roadWins'),
            'seasonId': team_info.get('seasonId'),
            'shootoutLosses': team_info.get('shootoutLosses'),
            'shootoutWins': team_info.get('shootoutWins'),
            'streakCode': team_info.get('streakCode'),
            'streakCount': team_info.get('streakCount'),
            'teamName_default': team_info.get('teamName', {}).get('default'),
            'teamCommonName_default': team_info.get('teamCommonName', {}).get('default'),
            'teamAbbrev_default': team_info.get('teamAbbrev', {}).get('default'),
            'teamLogo': team_info.get('teamLogo'),
            'winPctg': team_info.get('winPctg'),
            'wins': team_info.get('wins'),
            }
        standings_data_list.append(extracted_info)

# Create a DataFrame
df_standings = pd.DataFrame(standings_data_list)
```



## Game Action Information
The final set of data we can pull is the most important - the data for every action that occured in every game we specify.  This can take some time to run so I opted to run this on a season-by-season basis.  But you can pull this for specific games if you so choose:

```python
# Limit To 1 Season
df_LimitSeasons = df_games[(df_games['season'] == one_season_sel)]
# Create a List of GameIDs for the above date range
df_gameIDs = df_LimitSeasons['id'].drop_duplicates()
df_gameIDs = pd.DataFrame(df_gameIDs, columns=['id'])

# Initialize lists to hold data
all_basic_info = []
all_plays_info = []

# Loop through each row in the DataFrame
for index, row in df_gameIDs.iterrows():
    gameID = row['id']
    
    # Make HTTP request to NHL API for team data
    gameaction_url = f"https://api-web.nhle.com/v1/gamecenter/{gameID}/play-by-play"
    response = requests.get(gameaction_url)

    # Convert response to dictionary
    action_data = response.json()
    
    # Extracting basic information
    basic_info = {
        'id': action_data.get('id', 'n/a'),
        'season': action_data.get('season', 'n/a'),
        'gameType': action_data.get('gameType', 'n/a'),
        'gameDate': action_data.get('gameDate', 'n/a'),
        'venue': action_data.get('venue', {}).get('default', 'n/a'),
        'neutralSite': game.get('neutralSite', 'n/a'),
        'startTimeUTC': action_data.get('startTimeUTC', 'n/a'),
        'easternUTCOffset': action_data.get('easternUTCOffset', 'n/a'),
        'venueUTCOffset': action_data.get('venueUTCOffset', 'n/a'),
        'venueTimezone': game.get('venueTimezone', 'n/a'),
        'gameState': action_data.get('gameState', 'n/a'),
        'gameScheduleState': action_data.get('gameScheduleState', 'n/a'),
        'period': action_data.get('period', 'n/a'),
        'periodDescriptor_number': action_data.get('periodDescriptor', {}).get('number', 'n/a'),
        'periodDescriptor_periodType': action_data.get('periodDescriptor', {}).get('periodType', 'n/a'),
        'away_id': action_data['awayTeam'].get('id', 'n/a'),
        'away_name': action_data['awayTeam']['name'].get('default') if isinstance(action_data['awayTeam'], dict) else action_data['awayTeam'],
        'away_abbrev': action_data['awayTeam'].get('abbrev', 'n/a'),
        'awayTeamPlaceName': action_data['awayTeam'].get('placeName', {}).get('default', 'n/a'),
        'away_score': action_data['awayTeam'].get('score', 'n/a'),
        'away_sog': action_data['awayTeam'].get('sog', 'n/a'),
        'away_logo': action_data['awayTeam'].get('logo', 'n/a'),
        'home_id': action_data['homeTeam'].get('id', 'n/a'),
        'home_name': action_data['homeTeam']['name'].get('default') if isinstance(action_data['homeTeam'], dict) else action_data['homeTeam'],
        'home_abbrev': action_data['homeTeam'].get('abbrev', 'n/a'),
        'homeTeamPlaceName': action_data['homeTeam'].get('placeName', {}).get('default', 'n/a'),
        'home_score': action_data['homeTeam'].get('score', 'n/a'),
        'home_sog': action_data['homeTeam'].get('sog', 'n/a'),
        'home_logo': action_data['homeTeam'].get('logo', 'n/a'),
        'timeRemaining': action_data['clock'].get('timeRemaining', 'n/a'),
        'secondsRemaining': action_data['clock'].get('secondsRemaining', 'n/a'),
        'running': action_data['clock'].get('running', 'n/a'),
        'inIntermission': action_data['clock'].get('inIntermission', 'n/a'),
        'periodType': action_data.get('periodDescriptor', {}).get('periodType', 'n/a'),
        'gameOutcome_lastPeriodType': action_data.get('gameOutcome', {}).get('lastPeriodType', 'n/a')
    }
    all_basic_info.append(basic_info)


    # Extracting 'plays' data
    plays_data = action_data.get('plays', []) 

    for play in plays_data:
        details = play.get('details', {})
        play_info = {
            'id': action_data.get('id', 'n/a'),
            'eventId': play.get('eventId', 'n/a'),
            'period': play.get('period', 'n/a'),
            'timeInPeriod': play.get('timeInPeriod', 'n/a'),
            'timeRemaining': play.get('timeRemaining', 'n/a'),
            'situationCode': play.get('situationCode', 'n/a'),
            'homeTeamDefendingSide': play.get('homeTeamDefendingSide', 'n/a'),
            'typeCode': play.get('typeCode', 'n/a'),
            'typeDescKey': play.get('typeDescKey', 'n/a'),
            'sortOrder': play.get('sortOrder', 'n/a'),
            'eventOwnerTeamId': details.get('eventOwnerTeamId', 'n/a'),
            'losingPlayerId': details.get('losingPlayerId', 'n/a'),
            'winningPlayerId': details.get('winningPlayerId', 'n/a'),
            'xCoord': details.get('xCoord', 'n/a'),
            'yCoord': details.get('yCoord', 'n/a'),
            'zoneCode': details.get('zoneCode', 'n/a'),
            'shotType': details.get('shotType', 'n/a'),
            'scoringPlayerId': details.get('scoringPlayerId', 'n/a'),
            'scoringPlayerTotal': details.get('scoringPlayerTotal', 'n/a'),
            'assist1PlayerId': details.get('assist1PlayerId', 'n/a'),
            'assist1PlayerTotal': details.get('assist1PlayerTotal', 'n/a'),
            'assist2PlayerId': details.get('assist2PlayerId', 'n/a'),
            'assist2PlayerTotal': details.get('assist2PlayerTotal', 'n/a'),
            'goalieInNetId': details.get('goalieInNetId', 'n/a'),
            'awayScore': details.get('awayScore', 'n/a'),
            'homeScore': details.get('homeScore', 'n/a'),
            'playerId': details.get('playerId', 'n/a'),
            'shootingPlayerId': details.get('shootingPlayerId', 'n/a'),
            'awaySOG': details.get('awaySOG', 'n/a'),
            'homeSOG': details.get('homeSOG', 'n/a'),
            'reason': details.get('reason', 'n/a'),
            'hittingPlayerId': details.get('hittingPlayerId', 'n/a'),
            'hitteePlayerId': details.get('hitteePlayerId', 'n/a'),
            'blockingPlayerId': details.get('blockingPlayerId', 'n/a'),
            'descKey': details.get('descKey', 'n/a'),
            'duration': details.get('duration', 'n/a'),
            'committedByPlayerId': details.get('committedByPlayerId', 'n/a'),
            'drawnByPlayerId': details.get('drawnByPlayerId', 'n/a')
        }
        all_plays_info.append(play_info)

# Create DataFrames from the extracted data
GameAction_BasicInfo = pd.DataFrame(all_basic_info)
GameAction_Plays = pd.DataFrame(all_plays_info)
```

# Conclusion

This puts all the data into dataframes.  You can then export or work the data however you wish.  I chose to output this data to csv (old school) and work from there.

Good luck!

<br>
<br>
<br>

<div style="text-align:right;">
  <h4 style="display:inline-block; margin-bottom: 0;">#32</h4><br>
  <br>
  <span style="font-size: small;">Last Updated: 2024-04-14</span>
</div>