"""Shahal Ahammed K — portfolio site.

Run locally:      python app.py            -> http://127.0.0.1:5000
Export static:    python app.py build      -> ./dist (for GitHub Pages / Netlify)

All content lives in data/profile.json; edit that file to update the site.
"""
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, render_template, request

BASE = Path(__file__).resolve().parent
DATA_FILE = BASE / "data" / "profile.json"
MESSAGES_FILE = BASE / "data" / "messages.jsonl"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

app = Flask(__name__)


def load_profile():
    with DATA_FILE.open(encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index(static_build=False):
    return render_template(
        "index.html",
        p=load_profile(),
        year=datetime.now().year,
        static_build=static_build,
    )


@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or request.form
    name = (data.get("name") or "").strip()[:120]
    email = (data.get("email") or "").strip()[:200]
    message = (data.get("message") or "").strip()[:5000]

    if not name or not message or not EMAIL_RE.match(email):
        return jsonify(ok=False, error="Please fill in your name, a valid email and a message."), 400

    entry = {
        "at": datetime.now(timezone.utc).isoformat(),
        "name": name,
        "email": email,
        "message": message,
    }
    with MESSAGES_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return jsonify(ok=True)


def build_static(out_dir: Path = BASE / "dist"):
    """Render the site to plain HTML so it can be hosted anywhere."""
    if out_dir.exists():
        shutil.rmtree(out_dir)
    shutil.copytree(BASE / "static", out_dir / "static")
    with app.test_request_context("/"):
        html = index(static_build=True)
    (out_dir / "index.html").write_text(html, encoding="utf-8")
    (out_dir / ".nojekyll").write_text("")
    print(f"Static site written to {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        build_static()
    else:
        app.run(debug=True)
