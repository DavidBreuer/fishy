# Flask PWA - A progressive webapp template.

Flask PWA is supposed to be a goto template when I start a new Flask project. It is constructed on a Model-Template-Controller perspective, which I find clear enough for my current projects.

You can check a live version at [Heroku](https://flask-pwa.herokuapp.com).

## Work

The folder contains a simple Python Dash app.
Please add Progressive Web App (PWA) functionality with a server worker using the Google Workbox library for PWAs.
The page should be installable via a manifest file and it should cache all data reqired to run offline.

import dotenv

dotenv.load_dotenv('.env', override=True)

con = pg8000.connect(
    host=os.environ["DB_HOST"],
    port=os.environ["DB_PORT"],
    database=os.environ["DB_NAME"],
    user=os.environ["DB_USER"],
    password=os.environ["DB_WORD"],
)

query = """
SELECT * FROM pg_catalog.pg_tables;
"""

query = """
SELECT *
FROM information_schema.tables
"""

tab = pd.read_sql_query(query, con)

## Own commands

https://cloud.digitalocean.com/apps/b037eafa-f6b2-4acc-afa6-62517ab3c4d5/settings

https://flask-pwa-david-mr6ey.ondigitalocean.app/

flask run

In Qterminal, abort processes via CRTL+SHIFT+C

python
import dotenv
dotenv.load_dotenv()
os.getenv("DB_HOST")

https://blog.miguelgrinberg.com/post/create-a-react-flask-project-in-2025
https://medium.com/@inderpreet_singh/the-step-by-step-process-for-converting-a-react-app-with-flask-backend-to-a-pwa-86df529f0cbb

https://github.com/danny-baker/dash-heroku/tree/main
https://www.youtube.com/watch?v=aBWqWVBaqhI

# AI prompt

1. The folder contains a minimal Progressive Web Application using Python Plotly Dash.

1.1. Please look at the code structure and content to understand the setup, to be able to modify and extend it as follows.

2. Set up Flyway for database migrations for the PostgreSQL database with credentials given in the .env file

2.1. Create a table "locations" with columns
- uid = auto-incrementing integer primary key
- shop = varchar, required, non-null
- city = varchar, required, non-null
- street = varchar, required, non-null

2.2. Create a table "products" with columns
- uid = auto-incrementing integer primary key
- location_uid = foreign key to uid column in locations table, required, non-null
- name = varchar, required, non-null
- area = enum ('Tiefkühlung', 'Theke', 'Kühlung', 'Konserve', 'Aktion', 'Sonstiges'), required, non-null
- type = enum ('overview', 'product')
- label = enum ('ASC', 'GGN', 'Naturland', 'Ohne/Sonstiges'), required, non-null
- homebrand = bool, optional
- aquaculture = bool, optional
- species = enum ('Lachs', 'Forelle', 'Sonstiges', 'Unbekannt'), required, non-null
- note = text
- status = enum ('User - Eingetragen', 'User - Deaktiviert', 'Admin - Geprüft', 'Admin - Ausgeschlossen'), required, non-null

2.3. Create a table "photos" with columns
- uid = auto-incrementing integer primary key
- product_uid = foreign key to uid column in products table
- image = bytea for photos
- thumb = bytea for thumbnails of photos

3. Write a nice looking and responsive web app

3.1. The app works on regular smartphones as well as bigger screens
3.2. The app uses Python Plotly Dash and works as a progressive web application
3.3. If the app has internet connection, upload images and data to the database directly, otherwise cache the data locally and add a button (grayed out when no internet) to upload data later
3.4. Use re-usable and, ideally standard, components for the table views and input and edit forms

4. Design the user interface with 4 sections as follows

4.0. Opening screen
- When opening the web app, show some basic infos and a text input field, asking users to input their name (must be non-empty).
- After entering their name and clicking a "Start" button, store that name as session variable and set another session variable "role"="User"
- If the input text starts with "!!", then assign and store "role"="Admin"

4.1. Location selection
- Three coupled dropdowns next to each other which allow the location selection given by the locations database table: shop -> city -> street
- Start with empty dropdowns, such that none of the sections below is visible until a street has been selected
- In the top right corner, show a text field which shows the user name entered on the opening screen

4.2. Overview of shop-specific brands
- Depending on the selected shop, render the corresponding html file with the same name given in the app static folder
- Next to the shop-specific infos, show a collapsible box which contains infos about the three relevant labels

4.3. Product collection table per area (most important section)
- Depending on the selected shop -> city -> street, for each of the possible area enums, show two rows
- The first row shows the name of the area and an upload button for photos which automatically creates an entry in the products table (with type=overview), or ask for browser permissions to open the smartphone photo app directly.
- If photos have already been uploaded for that shop -> city -> street and area, show their thumbnail to the right of the upload button and adding photos adds them to the same existing type=overview entry in the products table.
- The second row shows the product table for the selected shop -> city -> street and area.
- Hide the name and area and type columns
- Hide the homebrand and aquaculture columns for regular users (non-admins)
- Each table row has a small edit icon and clicking that icon opens a (pre-populated) edit form for that entry which uses the whole space of the current browser window and has a "Cancel" and "Save" button.
- In addition to entry fields for the products table columns, add a button for uploading images (type=product) same as for the overview photos.
- Above the table is an add button which opens the same (but empty, except for the default values) form and allows users to add new products.
- When editing the status value of an entry, users with "role"="User" can only select the enum values starting with "User"
- If status value of an entry starts with "Admin", only "role"="Admin" users can edit that entry

4.4. Results summary table (show only data for type='product' and em=true entries)
- Show this section only if "role"="Admin"
- Show a summary table with columns: shop, city, street, label_asc, label_ggn, label_naturland, label_other, count
- The label value given as the number of product entries with that label divided by the total count of products (which is given in the last column)
- Show one row per shop (city and street columns are blank and aggregated over), one row per shop and city (street column is blank and aggregated over), one row per shop and city and street
- Add a button to download the table as in Excel (xlsx) format







## Requirements
- [Python 3.10.0](https://realpython.com/intro-to-pyenv/)

## Features

* Blueprint oriented, Flask 1.0 project
* Instantly deployable on Heroku
* Off-the-shelf progressive web app behaviour
* Service worker based on Workbox

## Installation

```shell
> git clone https://github.com/umluizlima/flask-pwa
> cd flask-pwa
> make environment
> make install
```

## Usage

Due to the current Service Worker [specification](https://w3c.github.io/ServiceWorker/#secure-context), the web browser will only allow its registration if the application is served over **https, or on localhost** for development purposes.

This makes **nGrok** useful for testing the PWA functionality, as it allows you to expose localhost over the internet with **https** included.

### localhost

```shell
> make run
```

### nGrok

```shell
> make flask run
> ngrok http 80
```

## Deployment

### Heroku

The `app.json`, `Procfile`, and `runtime.txt` files on this repository are specific for deployment on [Heroku](https://www.heroku.com). It can be done by clicking the following button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Links

- Repository: https://github.com/umluizlima/flask-pwa
- Issue tracker: https://github.com/umluizlima/flask-pwa/issues
- Inspiration and references:
  - [Google's Seu Primeiro PWA](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/?hl=pt-br)
  - [Flask PWA demo](https://github.com/uwi-info3180/flask-pwa)
  - [Google's Workbox](https://developers.google.com/web/tools/workbox/)

## Licensing

This project is licensed under MIT license.
