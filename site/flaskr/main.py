from email.mime import image
import logging
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from . import db
from flaskr.models import *
from sqlalchemy.sql import select, or_
import datetime


bp = Blueprint('main', __name__)

@bp.route('/', methods=['GET'])
def index():
    # if request.method == "POST":
    #     home_team = request.form.get("home_team")
    #     home_goals = request.form.get("home_goals")
    #     away_team = request.form.get("away_team")
    #     away_goals = request.form.get("away_goals")
    #     result = f"{home_team} {home_goals} - {away_goals} {away_team}"
    #     print(result)
    #     return render_template('index.html')
    # else:
        pl_teams_subquery = db.session.query(Fixture.home).filter(Fixture.event_date>'08-05-2022', Fixture.event_date<'08-05-2023', Fixture.league_id==39).subquery()
        pl_teams_query = db.session.query(Team).filter(Team.team_id.in_(select(pl_teams_subquery))).order_by(text("name asc"))
        pl_teams = pl_teams_query

        # main_team = request.form.get("main_team")

        players = db.session.query(Player).filter_by(team_id=42, active=True).all()

        return render_template('index.html', players=players, teams=pl_teams)


# @bp.route('/predict/', methods=('GET', 'POST'))
# def predict():
#     fixtures = db.session.query(Fixture).all()
#     return render_template('predict.html', fixtures=fixtures)


@bp.route('/api/fixtures', methods=['GET', 'POST'])
def api_fixtures():
    if request.method == "POST":
        post_data = request.json
        # print(post_data)
        main_team = post_data.get("team", 0)
    else:
        get_data = request.args.get("team", 0)
        main_team = get_data
        # print(get_data)

    main_fixtures_query = db.session.query(Fixture).filter(Fixture.event_date<datetime.datetime.now(), Fixture.event_date>'08-05-2022').filter(or_(Fixture.home==main_team, Fixture.away==main_team)).order_by(text("event_date asc")).all()
    # print(main_fixtures_query)
    return jsonify([{"home": f.home_team.name, "away": f.away_team.name, "date": f.event_date} for f in main_fixtures_query])


# new blueprint called api or something to be used by js
# js asks flask for json
# render around it
# 1. get all teams active for a season https://v3.football.api-sports.io/teams?league=39&season=2022
# 1.5 function to pull from different tables and marry teams + season
# 2. get all fixtures for t team https://v3.football.api-sports.io/fixtures?league=39&season=2022&team=42
# 3. get all players who participated in that fixture (for main team) https://v3.football.api-sports.io/fixtures/players?fixture=867946&team=42
