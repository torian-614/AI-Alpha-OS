<#
.SYNOPSIS
  Run research commands without the invalid localhost:9 proxy.

Usage:
  . .\scripts\clear_invalid_proxy.ps1
  python -m src.data.diagnostics --symbol 000001

The execution environment injects proxy variables per process, so clearing them
in this shell is safer than changing a machine-wide setting.
#>
$proxyNames = @('HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'GIT_HTTP_PROXY', 'GIT_HTTPS_PROXY', 'http_proxy', 'https_proxy', 'all_proxy')
foreach ($name in $proxyNames) {
    Set-Item -Path "Env:$name" -Value $null
}
$env:PIP_NO_INDEX = $null
Write-Host 'Invalid proxy variables cleared for this PowerShell session.'
