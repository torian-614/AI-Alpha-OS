from __future__ import annotations

from dataclasses import dataclass, field
from ..datasource import DataSource


@dataclass
class ProviderAttempt:
    provider: str
    success: bool
    records: int = 0
    error: str | None = None


@dataclass
class DataProviderRegistry:
    providers: dict[str, DataSource] = field(default_factory=dict)
    order: list[str] = field(default_factory=list)
    attempts: list[ProviderAttempt] = field(default_factory=list)
    unavailable: dict[str, str] = field(default_factory=dict)

    def register(self, name: str, provider: DataSource) -> None:
        self.providers[name] = provider
        if name not in self.order:
            self.order.append(name)

    def get_daily_history(self, symbol: str, start_date: str | None = None, end_date: str | None = None):
        errors: list[str] = []
        for name in self.order:
            provider = self.providers[name]
            try:
                frame = provider.get_daily_history(symbol, start_date, end_date)
                if frame is None or frame.empty:
                    raise ValueError("empty response")
                self.attempts.append(ProviderAttempt(name, True, len(frame)))
                return frame, provider
            except Exception as exc:
                message = f"{type(exc).__name__}: {exc}"
                errors.append(f"{name}: {message}")
                self.attempts.append(ProviderAttempt(name, False, error=message))
        raise RuntimeError("all data providers failed: " + "; ".join(errors))


def get_optional_provider_status() -> dict[str, dict[str, str | None]]:
    """Report optional provider availability without contacting any provider."""
    from .mootdx_provider import mootdx_status

    return {"mootdx": mootdx_status()}


def build_default_provider_registry() -> DataProviderRegistry:
    """Build the optional-provider registry without changing the live pipeline."""
    from .mootdx_provider import MootdxDataSource

    registry = DataProviderRegistry()
    status = get_optional_provider_status()["mootdx"]
    if status["status"] == "AVAILABLE":
        registry.register("mootdx", MootdxDataSource())
    else:
        registry.unavailable["mootdx"] = status["reason"] or "mootdx is unavailable"
    return registry
