try:
    import pytest
except ModuleNotFoundError:  # Allow unittest discovery to run without pytest installed.
    pytest = None

from src.data.providers.mootdx_provider import MootdxDataSource
from src.data.providers.registry import build_default_provider_registry, get_optional_provider_status


def test_mootdx_status_always_exposes_availability_and_reason():
    status = get_optional_provider_status()["mootdx"]
    assert status["status"] in {"AVAILABLE", "UNAVAILABLE"}
    if status["status"] == "UNAVAILABLE":
        assert status["reason"]


def test_default_registry_only_registers_mootdx_when_available():
    status = get_optional_provider_status()["mootdx"]
    registry = build_default_provider_registry()
    if status["status"] == "AVAILABLE":
        assert isinstance(registry.providers["mootdx"], MootdxDataSource)
    else:
        assert "mootdx" not in registry.providers
        assert registry.unavailable["mootdx"] == status["reason"]


def test_unavailable_mootdx_client_reports_reason():
    status = get_optional_provider_status()["mootdx"]
    if status["status"] == "AVAILABLE":
        pytest.skip("mootdx is installed; this test covers the unavailable path")
    with pytest.raises(RuntimeError, match="mootdx"):
        MootdxDataSource()._client()


def _mootdx_test_marker(test):
    return pytest.mark.mootdx(test) if pytest is not None else test


@_mootdx_test_marker
def test_mootdx_provider_constructs_when_dependency_is_installed():
    provider = MootdxDataSource()
    assert provider.source == "mootdx"
