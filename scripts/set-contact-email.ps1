<#
  Changes the public contact email everywhere it appears (all pages under docs/ and README.md).
  Usage:  powershell -ExecutionPolicy Bypass -File scripts\set-contact-email.ps1 -Old old@example.com -New new@example.com
  Then review with `git diff`, and commit. Nothing is published by this script.
#>
param(
  [Parameter(Mandatory = $true)][string]$Old,
  [Parameter(Mandatory = $true)][string]$New
)
$ErrorActionPreference = 'Stop'
$pattern = '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
if ($Old -notmatch $pattern) { throw "Old address is not a valid email: $Old" }
if ($New -notmatch $pattern) { throw "New address is not a valid email: $New" }
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$files = @(Get-ChildItem -Path (Join-Path $root 'docs') -Recurse -File -Include *.html, *.xml, *.txt) + (Get-Item (Join-Path $root 'README.md'))
$total = 0
foreach ($f in $files) {
  $text = [IO.File]::ReadAllText($f.FullName, $utf8)
  $count = ([regex]::Matches($text, [regex]::Escape($Old))).Count
  if ($count -gt 0) {
    [IO.File]::WriteAllText($f.FullName, $text.Replace($Old, $New), $utf8)
    Write-Output ("{0}: {1} replacement(s)" -f $f.FullName.Substring($root.Length + 1), $count)
    $total += $count
  }
}
Write-Output "Total replacements: $total"
if ($total -eq 0) { Write-Warning 'The old address was not found.' }
