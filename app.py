import os
from dash import Dash, html, dcc, callback, Output, Input
import plotly.express as px
import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminder_unfiltered.csv')

import dotenv
dotenv.load_dotenv()
db_host = os.getenv("DB_HOST")
print(db_host)

import gunicorn                     #whilst your local machine's webserver doesn't need this, Heroku's linux webserver (i.e. dyno) does. I.e. This is your HTTP server
from whitenoise import WhiteNoise   #for serving static files on Heroku

app = Dash(
    __name__,
    # Inject PWA meta tags and manifest link into every page's <head>
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1"},
        {"name": "theme-color", "content": "#0077b6"},
        {"name": "mobile-web-app-capable", "content": "yes"},
        {"name": "apple-mobile-web-app-capable", "content": "yes"},
        {"name": "apple-mobile-web-app-status-bar-style", "content": "default"},
        {"name": "apple-mobile-web-app-title", "content": "Fishy"},
    ],
)

# ─── PWA: custom index string ─────────────────────────────────────────────────
# Dash's index_string lets us insert the <link rel="manifest"> tag and Apple
# touch icon that the standard meta_tags list cannot express.
app.index_string = """<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>Fishy</title>
        {%favicon%}
        <!-- PWA Manifest -->
        <link rel="manifest" href="/manifest.json">
        <!-- Apple touch icon (falls back to icon-192) -->
        <link rel="apple-touch-icon" href="/icon-192.png">
        {%css%}
    </head>
    <body>
        <!-- PWA install banner (hidden until beforeinstallprompt fires) -->
        <div id="pwa-install-banner"
             style="display:none; align-items:center; justify-content:space-between;
                    background:#0077b6; color:#fff; padding:10px 16px;
                    font-family:sans-serif; font-size:14px; position:sticky;
                    top:0; z-index:9999;">
            <span>📲 Add Fishy to your home screen</span>
            <button onclick="
                if(window._pwaInstallPrompt){
                    window._pwaInstallPrompt.prompt();
                    window._pwaInstallPrompt.userChoice.then(function(r){
                        window._pwaInstallPrompt = null;
                        document.getElementById('pwa-install-banner').style.display='none';
                    });
                }"
                style="background:#fff; color:#0077b6; border:none; border-radius:4px;
                       padding:6px 14px; cursor:pointer; font-weight:bold;">
                Install
            </button>
        </div>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>"""

# Reference the underlying flask app (Used by gunicorn webserver in Heroku production deployment)
server = app.server

# Enable Whitenoise for serving static files from Heroku (the /static folder is seen as root by Heroku)
server.wsgi_app = WhiteNoise(server.wsgi_app, root="static/")

# ─── Explicit Flask route for sw.js ──────────────────────────────────────────
# The service worker MUST be served from the root scope (/sw.js), not from a
# sub-path.  WhiteNoise already serves everything in /static at the root, so
# /sw.js and /manifest.json are automatically available.  The route below is a
# safety net for environments where WhiteNoise is not active (e.g. plain
# `flask run`).
import flask


@server.route("/sw.js")
def serve_sw():
    return flask.send_from_directory(
        "static", "sw.js", mimetype="application/javascript"
    )


@server.route("/manifest.json")
def serve_manifest():
    return flask.send_from_directory(
        "static", "manifest.json", mimetype="application/manifest+json"
    )


# Requires Dash 2.17.0 or later
app.layout = [
    html.H1(children='Title of Dash App', style={'textAlign':'center'}),
    dcc.Dropdown(df.country.unique(), 'Canada', id='dropdown-selection'),
    dcc.Graph(id='graph-content'),
    html.Img(src='heart.png'),
]

@callback(
    Output('graph-content', 'figure'),
    Input('dropdown-selection', 'value')
)
def update_graph(value):
    dff = df[df.country==value]
    return px.line(dff, x='year', y='pop')

if __name__ == '__main__':
    try:
        print('gunicorn')
        app.run_server(debug=True, host="0.0.0.0", port=8500)
    except:
        print('local')
        app.run(debug=True)
