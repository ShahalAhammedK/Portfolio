"""Shahal Ahammed K — portfolio site.

Run locally:      python app.py            -> http://127.0.0.1:5000
Export static:    python app.py build      -> ./dist (for GitHub Pages / Netlify)

All content lives in data/profile.json; edit that file to update the site.
"""
import json
import os
import re
import shutil
import sys
import threading
import time
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from flask import Flask, jsonify, render_template, request

BASE = Path(__file__).resolve().parent
DATA_FILE = BASE / "data" / "profile.json"
MESSAGES_FILE = BASE / "data" / "messages.jsonl"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 64 * 1024  # contact messages are small; reject huge bodies
app.jinja_env.globals["has_static"] = lambda rel: (BASE / "static" / rel).is_file()

# Security headers, shared by the Flask server and the static build (_headers file).
CSP = "; ".join([
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
])
SECURITY_HEADERS = {
    "Content-Security-Policy": CSP,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Cross-Origin-Opener-Policy": "same-origin",
}

# Contact form limits: per visitor IP, and a cap on the stored messages file.
RATE_LIMIT = 5               # messages
RATE_WINDOW = 10 * 60        # per 10 minutes
MAX_MESSAGES_BYTES = 5 * 1024 * 1024
_hits = defaultdict(deque)
_lock = threading.Lock()


@app.after_request
def add_security_headers(resp):
    for k, v in SECURITY_HEADERS.items():
        resp.headers.setdefault(k, v)
    return resp


def _rate_limited(ip: str) -> bool:
    now = time.monotonic()
    with _lock:
        q = _hits[ip]
        while q and now - q[0] > RATE_WINDOW:
            q.popleft()
        if len(q) >= RATE_LIMIT:
            return True
        q.append(now)
        return False


def _same_origin() -> bool:
    """Reject posts sent from other websites (browsers always send Origin on cross-site POSTs)."""
    origin = request.headers.get("Origin")
    if not origin:
        return True
    return urlparse(origin).netloc == request.host


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
    if not request.is_json:
        return jsonify(ok=False, error="Send the form as JSON."), 415
    if not _same_origin():
        return jsonify(ok=False, error="Cross-site requests are not allowed."), 403
    if _rate_limited(request.remote_addr or "unknown"):
        return jsonify(ok=False, error="Too many messages. Please try again later or email me directly."), 429

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(ok=False, error="Invalid request."), 400

    def field(key, limit):
        value = data.get(key)
        return value.strip()[:limit] if isinstance(value, str) else ""

    name = field("name", 120)
    email = field("email", 200)
    message = field("message", 5000)

    if not name or not message or not EMAIL_RE.match(email):
        return jsonify(ok=False, error="Please fill in your name, a valid email and a message."), 400

    if MESSAGES_FILE.exists() and MESSAGES_FILE.stat().st_size > MAX_MESSAGES_BYTES:
        return jsonify(ok=False, error="The inbox is full. Please email me directly."), 503

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
    # Security headers for static hosts that read a _headers file (Cloudflare, Netlify).
    rules = "\n".join(f"  {k}: {v}" for k, v in SECURITY_HEADERS.items())
    (out_dir / "_headers").write_text(f"/*\n{rules}\n", encoding="utf-8")
    # Not part of the site; keep it out of the published files.
    (out_dir / "static" / "img" / "phones" / "README.md").unlink(missing_ok=True)
    print(f"Static site written to {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        build_static()
    else:
        # The interactive debugger can run code; only enable it explicitly for local work.
        app.run(debug=os.environ.get("FLASK_DEBUG") == "1")
