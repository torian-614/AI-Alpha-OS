"""Shared pytest configuration for optional provider tests."""

import importlib.util

import pytest


def pytest_collection_modifyitems(config, items):
    """Skip mootdx-specific tests when the optional package is unavailable."""
    if importlib.util.find_spec("mootdx") is not None:
        return

    skip = pytest.mark.skip(reason="optional dependency mootdx is not installed")
    for item in items:
        if "mootdx" in item.keywords:
            item.add_marker(skip)
