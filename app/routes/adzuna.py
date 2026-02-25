import os
import requests
from flask import Blueprint, request, jsonify

adzuna_bp = Blueprint("adzuna", __name__)


@adzuna_bp.route("/search", methods=["GET"])
def search_adzuna():
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("dabb8c05e89b687e7274161cbe41d8ab")
    if not app_id or not app_key:
        return jsonify({"error": "Adzuna API credentials are not configured"}), 500

    country = request.args.get("country", os.getenv("ADZUNA_COUNTRY", "us")).lower()
    page = request.args.get("page", default=1, type=int)
    query = request.args.get("query", type=str, default="").strip()
    location = request.args.get("location", type=str, default="").strip()
    salary_min = request.args.get("salary_min", type=int)
    salary_max = request.args.get("salary_max", type=int)
    results_per_page = request.args.get("results_per_page", default=20, type=int)
    sort_by = request.args.get("sort_by", type=str, default="").strip()

    params = {
        "app_id": app_id,
        "app_key": app_key,
        "results_per_page": results_per_page,
    }
    if query:
        params["what"] = query
    if location:
        params["where"] = location
    if salary_min is not None:
        params["salary_min"] = salary_min
    if salary_max is not None:
        params["salary_max"] = salary_max
    if sort_by:
        params["sort_by"] = sort_by

    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/{page}"

    try:
        res = requests.get(url, params=params, timeout=15)
    except requests.RequestException as exc:
        return jsonify({"error": "Failed to reach Adzuna API", "detail": str(exc)}), 502

    if not res.ok:
        return jsonify({"error": "Adzuna API error", "detail": res.text}), res.status_code

    return jsonify(res.json()), 200
