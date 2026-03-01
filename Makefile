

.PHONY: run
run:
	uv run python app.py
	
.PHONY: run
gc:
	gunicorn -b 0.0.0.0:8050 app:server
