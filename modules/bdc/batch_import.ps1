# Batch import 42 BDC files. Match by leading code prefix (A1., A10., B1., ...)
$ErrorActionPreference = 'Stop'
$srcDir = 'D:\3F. Bang doi chieu QCVN10 (FN)\3F. Bang doi chieu QCVN10 (FN)'
$dstDir = 'D:\Dự án web tính toán PCCC\modules\bdc\source'
$mapPath = 'D:\Dự án web tính toán PCCC\modules\bdc\mapping.json'

$mapping = Get-Content $mapPath -Raw -Encoding UTF8 | ConvertFrom-Json
$all = @($mapping.congTrinh) + @($mapping.heThong)
if (!(Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir | Out-Null }

# Build index: prefix code (A1, A10, B1...) -> actual FileInfo
$index = @{}
Get-ChildItem $srcDir | ForEach-Object {
  if ($_.Name -match '^([A-Z]\d+)\.?\s') {
    $code = $matches[1]
    $index[$code] = $_
  }
}
Write-Host "Indexed $($index.Count) source files."

# Word for .doc conversion
$word = $null
$ok = 0; $miss = 0; $err = 0
$results = @()
foreach ($m in $all) {
  $code = $m.ma  # 'A1', 'B16', etc
  if (-not $index.ContainsKey($code)) {
    Write-Host "  MISS: $($m.id) (no file matching code $code)" -ForegroundColor Yellow
    $miss++; continue
  }
  $srcFile = $index[$code]
  $dstPath = Join-Path $dstDir "$($m.id).docx"
  try {
    if ($srcFile.Extension -eq '.docx') {
      Copy-Item -LiteralPath $srcFile.FullName -Destination $dstPath -Force
    } else {
      if ($null -eq $word) {
        Write-Host "Spawning Word for .doc conversion..."
        $word = New-Object -ComObject Word.Application
        $word.Visible = $false
        $word.DisplayAlerts = 0
      }
      $doc = $word.Documents.Open([string]$srcFile.FullName)
      $doc.SaveAs2([string]$dstPath, 16)  # wdFormatXMLDocument = 16
      $doc.Close($false)
    }
    Write-Host "  OK:   $($m.id) <- $($srcFile.Name)"
    $ok++
    $results += [PSCustomObject]@{ id=$m.id; ma=$m.ma; src=$srcFile.Name; converted=($srcFile.Extension -ne '.docx') }
  } catch {
    Write-Host "  ERR:  $($m.id) - $($_.Exception.Message)" -ForegroundColor Red
    $err++
  }
}

if ($word) { $word.Quit(); [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null }
Write-Host ""
Write-Host "Summary: ok=$ok miss=$miss err=$err total=$($all.Count)"
