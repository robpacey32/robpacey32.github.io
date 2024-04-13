---
layout: page
title: How To
subtitle: A guide to everything I've tried to do
---


### Intro
The first thing you need when wanting to look at NHL data is NHL data.  Unfortunately there isn't too much documentation, but there is an API and resources (like [https://github.com/Zmalski/NHL-API-Reference](https://github.com/Zmalski/NHL-API-Reference)) which help along the way.

The main things I wanted to achieve was a table with all actions.  For every shot, hit, goal etc. I wanted a table with all of the possible informatiion.  This could then be supplemented with standings information, roster information etc.

### Set Up
There are many different ways to do this.  My preference is to run python script in JupyterLab within Anaconda:
![AnacondaScreenshot](/assets/img/AnacondaScreenshot.png){: .mx-auto.d-block :}

You can then open a notebook:
![AnacondaScreenshot2](/assets/img/AnacondaScreenshot2.png){: .mx-auto.d-block :}

### The Code

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

There are other elements to the team information we could pull, however these are live/updated metrics which I may need to calculate myself on different time periods, rather than just seeing the latest information.  If you want this, add the variables to the "for team in team_data_extract@ loop in the code above.
Possible variables include:

<div style="text-align:center;">

| summary | faceoffpercentages | daysbetweengames | faceoffwins | goalsagainstbystrength | 
| goalsbyperiod | goalsforbystrength | leadingtrailing | realtime | outshootoutshotby | 
| penalties | penaltykill | penaltykilltime | powerplay | powerplaytime | 
| summaryshooting | percentages | scoretrailfirst | shootout | shottype | 
| goalgames |  |  |  |  | 

</div>

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



####  #32
