---
title: Plotly Dash
date: '2020-08-14'
---

How do we split a Plotly Dash app into different Flask files?
At first, their docs on [Beyond the Basics/Multi-Page Apps and URL support](https://dash.plotly.com/urls) look like they might be the place to look.

But nah, there are route collisions and workarounds which throw away some neat debugging features:

> Since we're adding callbacks to elements that don't exist in the app.layout, Dash will raise an exception to warn us that we might be doing something wrong. In this case, we're adding the elements through a callback, so we can ignore the exception by setting suppress_callback_exceptions=True. It is also possible to do this without suppressing callback exceptions. See the example below for details.

But looking a little further, [this](https://dash.plotly.com/integrating-dash) kind of covers it.

Here is what I did. First, we write the individual dash apps like this:

`dash_apps/app1.py`

```python
import dash
from dash.dash import no_update
from dash.dependencies import Input, Output, State
import dash_daq as daq
import dash_core_components as dcc
import dash_html_components as html


def create_dashboard(server):
    app = dash.Dash(
        server=server,
        routes_pathname_prefix='/upload/',
    )

    @app.callback(Output("output-message", "children"), [Input("input1", "value")])
    def update_output(inputText):
        return f"Said: {inputText}"

    app.layout = html.Div(
        children=[
            html.A('Home', href='/'),
            Input(id="input1", type="text", placeholder=""),
            html.Div(id="output-message")
            ]
            )
    return app.server
```

Write as many of these as you like.
Then import them into a global index app like this:

`index.py`

```python
from flask import Flask, render_template, app
from dash_apps import app1, app2, app3

def create_app():
    print("Creating app")
    app = Flask(__name__, instance_relative_config=False)

    @app.route('/')
    def home():
        """Landing page."""
        return """
        <a href='/app1'>App 1</a><br>
        <a href='/app2'>App 2</a><br>
        <a href='/app3'>App 3</a>
        """

    with app.app_context():
        app = app1.create_dashboard(app)
        app = app2.create_dashboard(app)
        app = app3.create_dashboard(app)

    return app
```

Easy!

## Deploying to App Engine

`app.yaml`

```yaml
service: dash-app
runtime: python37
entrypoint: gunicorn -b :$PORT 'index:create_app()'
instance_class: B8
basic_scaling:
    max_instances: 1
    idle_timeout: 30m
```
