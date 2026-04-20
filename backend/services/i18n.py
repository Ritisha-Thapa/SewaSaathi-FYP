from __future__ import annotations

from typing import Any


SUPPORTED_LANGUAGES = {"en", "ne"}
DEFAULT_LANGUAGE = "en"


def normalize_language(language_code: str | None) -> str:
    if not language_code:
        return DEFAULT_LANGUAGE

    primary = language_code.strip().lower().replace("_", "-").split("-")[0]
    return primary if primary in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE


def get_request_language(request) -> str:
    query_language = normalize_language(request.query_params.get("lang"))
    if request.query_params.get("lang"):
        return query_language

    explicit_header_language = normalize_language(request.headers.get("X-Language"))
    if request.headers.get("X-Language"):
        return explicit_header_language

    accept_language = request.headers.get("Accept-Language", "")
    for part in accept_language.split(","):
        candidate = normalize_language(part.split(";")[0])
        if candidate in SUPPORTED_LANGUAGES:
            return candidate

    return DEFAULT_LANGUAGE


def get_localized_value(default_value: Any, translations: dict[str, Any] | None, language: str) -> Any:
    translations = translations or {}

    if language != DEFAULT_LANGUAGE:
        localized_value = translations.get(language)
        if localized_value not in (None, ""):
            return localized_value

    english_value = translations.get(DEFAULT_LANGUAGE)
    if english_value not in (None, ""):
        return english_value

    return default_value
