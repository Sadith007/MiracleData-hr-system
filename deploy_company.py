"""
HR Nexus - Deploy New Company to GitHub Pages
=============================================
Usage:
  python deploy_company.py

Requirements:
  pip install requests

You need a GitHub Fine-Grained Personal Access Token with:
  - Contents: Read & Write
  - Pages: Read & Write (if auto-enabling Pages)
"""

import requests
import base64
import json
import re
import sys
import time

# ─── CONFIG ───────────────────────────────────────────────────────────────────
GITHUB_TOKEN  = "YOUR_GITHUB_TOKEN_HERE"   # Fine-grained PAT
GITHUB_USER   = "sadith007"                # Your GitHub username
HR_NEXUS_FILE = "index.html"               # Path to your HR Nexus HTML file
# ──────────────────────────────────────────────────────────────────────────────

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

def slugify(name):
    return re.sub(r'_+', '-', re.sub(r'[^a-z0-9]', '-', name.lower())).strip('-')[:40]

def api(method, path, **kwargs):
    url = f"https://api.github.com{path}"
    r = getattr(requests, method)(url, headers=HEADERS, **kwargs)
    return r

def check_token():
    r = api("get", "/user")
    if r.status_code != 200:
        print(f"❌ Token error: {r.json().get('message','Unknown error')}")
        sys.exit(1)
    print(f"✅ Logged in as: {r.json()['login']}")

def repo_exists(repo_name):
    r = api("get", f"/repos/{GITHUB_USER}/{repo_name}")
    return r.status_code == 200

def create_repo(repo_name, description):
    r = api("post", "/user/repos", json={
        "name": repo_name,
        "description": description,
        "private": False,
        "auto_init": False,
        "has_issues": False,
        "has_projects": False,
        "has_wiki": False,
    })
    if r.status_code == 201:
        print(f"✅ Repo created: https://github.com/{GITHUB_USER}/{repo_name}")
        return True
    else:
        print(f"❌ Failed to create repo: {r.json().get('message','')}")
        return False

def get_file_sha(repo_name, path="index.html"):
    r = api("get", f"/repos/{GITHUB_USER}/{repo_name}/contents/{path}")
    if r.status_code == 200:
        return r.json().get("sha")
    return None

def upload_file(repo_name, content_bytes, company_slug, company_name):
    """Upload index.html with ?company= already embedded as default"""
    # Inject company param as a JS constant so it works without URL param too
    inject = f"""
    // ── AUTO-INJECTED BY DEPLOY SCRIPT ──
    (function() {{
      const _urlP = new URLSearchParams(window.location.search);
      if (!_urlP.has('company')) {{
        const url = new URL(window.location.href);
        url.searchParams.set('company', '{company_slug}');
        window.history.replaceState({{}},'', url.toString());
      }}
    }})();
    """
    html = content_bytes.decode("utf-8")
    # Insert inject snippet just before </head>
    html = html.replace("</head>", f"<script>{inject}</script>\n</head>", 1)
    
    encoded = base64.b64encode(html.encode("utf-8")).decode("utf-8")
    sha = get_file_sha(repo_name)
    
    payload = {
        "message": f"🚀 Deploy HR Nexus for {company_name}",
        "content": encoded,
        "branch": "main",
    }
    if sha:
        payload["sha"] = sha

    r = api("put", f"/repos/{GITHUB_USER}/{repo_name}/contents/index.html", json=payload)
    if r.status_code in (200, 201):
        print(f"✅ index.html uploaded")
        return True
    else:
        print(f"❌ Upload failed: {r.json().get('message','')}")
        return False

def enable_pages(repo_name):
    """Enable GitHub Pages on main branch"""
    r = api("post", f"/repos/{GITHUB_USER}/{repo_name}/pages", json={
        "source": {"branch": "main", "path": "/"}
    })
    if r.status_code in (200, 201):
        print(f"✅ GitHub Pages enabled")
        return True
    elif r.status_code == 409:
        print(f"ℹ️  GitHub Pages already enabled")
        return True
    else:
        msg = r.json().get('message','')
        print(f"⚠️  Pages enable: {msg} (may need manual enable in repo Settings → Pages)")
        return False

def wait_for_pages(repo_name, timeout=90):
    """Poll until Pages is live"""
    print("⏳ Waiting for GitHub Pages to go live", end="", flush=True)
    deadline = time.time() + timeout
    while time.time() < deadline:
        r = api("get", f"/repos/{GITHUB_USER}/{repo_name}/pages")
        if r.status_code == 200:
            status = r.json().get("status")
            url = r.json().get("html_url","")
            if status == "built" and url:
                print(f"\n✅ Live at: {url}")
                return url
        print(".", end="", flush=True)
        time.sleep(5)
    print("\n⚠️  Timed out waiting for Pages. Check repo Settings → Pages manually.")
    return f"https://{GITHUB_USER}.github.io/{repo_name}/"

def main():
    print("\n╔══════════════════════════════════════╗")
    print("║   HR Nexus — Deploy New Company      ║")
    print("╚══════════════════════════════════════╝\n")

    check_token()

    company_name = input("\n🏢 Company name (e.g. Miracle Data): ").strip()
    if not company_name or len(company_name) < 2:
        print("❌ Invalid company name"); sys.exit(1)

    company_slug = slugify(company_name)
    repo_name = f"hr-nexus-{company_slug}"

    print(f"\n📋 Summary:")
    print(f"   Company : {company_name}")
    print(f"   Slug    : {company_slug}")
    print(f"   Repo    : https://github.com/{GITHUB_USER}/{repo_name}")
    print(f"   URL     : https://{GITHUB_USER}.github.io/{repo_name}/?company={company_slug}")

    confirm = input("\nProceed? (y/n): ").strip().lower()
    if confirm != 'y':
        print("Cancelled."); sys.exit(0)

    # Read HR Nexus file
    try:
        with open(HR_NEXUS_FILE, "rb") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ {HR_NEXUS_FILE} not found. Run this script in the same folder as index.html")
        sys.exit(1)

    print()
    # Create repo if not exists
    if repo_exists(repo_name):
        print(f"ℹ️  Repo already exists, updating...")
    else:
        if not create_repo(repo_name, f"HR Nexus - {company_name}"):
            sys.exit(1)
        time.sleep(2)  # brief wait after creation

    # Upload file
    if not upload_file(repo_name, content, company_slug, company_name):
        sys.exit(1)

    # Enable Pages
    enable_pages(repo_name)
    time.sleep(3)

    # Wait and print final URL
    live_url = wait_for_pages(repo_name)
    final_url = f"{live_url.rstrip('/')}/?company={company_slug}"

    print(f"\n🎉 Done!")
    print(f"   App URL : {final_url}")
    print(f"   Share this URL with your client: {final_url}\n")

if __name__ == "__main__":
    main()
