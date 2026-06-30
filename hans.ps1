#Requires -Version 5.1
# Deltarune Chinese Patch Installer
# Usage: irm https://dreditorcn.genouka.top/hans.ps1 | iex

param(
    [string]$GamePath = ""
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName PresentationFramework

# ========== 配置 ==========
$BaseUrl = "https://dreditorcn.genouka.top"
$GitHubApiUrl = "https://api.github.com/repos/gm3dr/DeltaruneChinese/releases/latest"
$GitHubReleasesUrl = "https://github.com/gm3dr/DeltaruneChinese/releases/latest"

# ========== 全局变量 ==========
$script:SelectedAsset = $null
$script:ReleaseInfo = $null
$script:TempDir = $null
$script:BackupList = @()
$script:FailedOperations = @()

# ========== 工具函数 ==========

function Show-ErrorDialog {
    param([string]$Message, [string]$Title = "错误")
    [System.Windows.Forms.MessageBox]::Show($Message, $Title, "OK", "Error") | Out-Null
}

function Show-InfoDialog {
    param([string]$Message, [string]$Title = "提示")
    [System.Windows.Forms.MessageBox]::Show($Message, $Title, "OK", "Information") | Out-Null
}

function Show-ConfirmDialog {
    param([string]$Message, [string]$Title = "确认")
    $result = [System.Windows.Forms.MessageBox]::Show($Message, $Title, "YesNo", "Question")
    return $result -eq [System.Windows.Forms.DialogResult]::Yes
}

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message"
}

# ========== 下载工具 ==========

function Get-ToolPath {
    param([string]$ToolName)
    
    # 先检查当前目录
    $localPath = Join-Path $PSScriptRoot $ToolName
    if (Test-Path $localPath) { return $localPath }
    
    # 检查脚本所在目录
    $localPath = Join-Path (Get-Location) $ToolName
    if (Test-Path $localPath) { return $localPath }
    
    # 检查 PATH
    $pathTool = Get-Command $ToolName -ErrorAction SilentlyContinue
    if ($pathTool) { return $pathTool.Source }
    
    return $null
}

function Download-Tool {
    param([string]$ToolName, [string]$DisplayName)
    
    $toolPath = Get-ToolPath -ToolName $ToolName
    if ($toolPath) {
        Write-Log "$DisplayName 已找到: $toolPath"
        return $toolPath
    }
    
    Write-Log "正在下载 $DisplayName..."
    $toolUrl = "$BaseUrl/$ToolName"
    $savePath = Join-Path $env:TEMP $ToolName
    
    try {
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $toolUrl -OutFile $savePath -UseBasicParsing -ErrorAction Stop
        $ProgressPreference = 'Continue'
        
        if (Test-Path $savePath) {
            Write-Log "$DisplayName 下载完成: $savePath"
            return $savePath
        }
    }
    catch {
        Write-Log "下载 $DisplayName 失败: $_"
        return $null
    }
    return $null
}

# ========== GitHub Release 获取 ==========

function Get-LatestRelease {
    Write-Log "正在获取最新版本信息..."
    
    try {
        $headers = @{
            "User-Agent" = "DeltaruneChinesePatchInstaller/1.0"
            "Accept" = "application/vnd.github.v3+json"
        }
        
        $ProgressPreference = 'SilentlyContinue'
        $release = Invoke-RestMethod -Uri $GitHubApiUrl -Headers $headers -ErrorAction Stop
        $ProgressPreference = 'Continue'
        
        $script:ReleaseInfo = $release
        return $release
    }
    catch {
        Write-Log "通过API获取失败，尝试备用方式..."
        try {
            # 备用：尝试解析HTML
            $ProgressPreference = 'SilentlyContinue'
            $response = Invoke-WebRequest -Uri $GitHubReleasesUrl -UseBasicParsing -ErrorAction Stop
            $ProgressPreference = 'Continue'
            
            # 简单返回，让用户手动选择
            Show-ErrorDialog "无法自动获取发布列表。请访问 $GitHubReleasesUrl 手动下载。"
            return $null
        }
        catch {
            Show-ErrorDialog "获取版本信息失败: $_"
            return $null
        }
    }
}

# ========== GUI: 选择补丁文件 ==========

function Show-AssetSelectionDialog {
    param([array]$Assets)
    
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "选择 Deltarune 汉化补丁"
    $form.Size = New-Object System.Drawing.Size(700, 450)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false
    $form.MinimizeBox = $false
    
    # 标题标签
    $titleLabel = New-Object System.Windows.Forms.Label
    $titleLabel.Location = New-Object System.Drawing.Point(20, 15)
    $titleLabel.Size = New-Object System.Drawing.Size(650, 25)
    $titleLabel.Font = New-Object System.Drawing.Font("Microsoft YaHei", 11, [System.Drawing.FontStyle]::Bold)
    $titleLabel.Text = "Deltarune 汉化补丁安装器"
    $form.Controls.Add($titleLabel)
    
    # 版本信息
    $versionLabel = New-Object System.Windows.Forms.Label
    $versionLabel.Location = New-Object System.Drawing.Point(20, 45)
    $versionLabel.Size = New-Object System.Drawing.Size(650, 20)
    $versionLabel.Font = New-Object System.Drawing.Font("Microsoft YaHei", 9)
    $versionLabel.Text = "版本: $($script:ReleaseInfo.tag_name) | 发布日期: $($script:ReleaseInfo.published_at)"
    $form.Controls.Add($versionLabel)
    
    # 说明标签
    $descLabel = New-Object System.Windows.Forms.Label
    $descLabel.Location = New-Object System.Drawing.Point(20, 75)
    $descLabel.Size = New-Object System.Drawing.Size(650, 20)
    $descLabel.Text = "请选择要下载的补丁文件："
    $form.Controls.Add($descLabel)
    
    # 列表框
    $listBox = New-Object System.Windows.Forms.ListBox
    $listBox.Location = New-Object System.Drawing.Point(20, 100)
    $listBox.Size = New-Object System.Drawing.Size(640, 200)
    $listBox.Font = New-Object System.Drawing.Font("Consolas", 10)
    
    foreach ($asset in $Assets) {
        $sizeMB = [math]::Round($asset.size / 1MB, 2)
        $displayText = "$($asset.name)  ($sizeMB MB)"
        $listBox.Items.Add($displayText) | Out-Null
    }
    
    if ($listBox.Items.Count -gt 0) {
        $listBox.SelectedIndex = 0
    }
    
    $form.Controls.Add($listBox)
    
    # 文件说明
    $infoLabel = New-Object System.Windows.Forms.Label
    $infoLabel.Location = New-Object System.Drawing.Point(20, 310)
    $infoLabel.Size = New-Object System.Drawing.Size(640, 50)
    $infoLabel.Text = "说明:`n- windowslinux: Windows/Linux 完整版`n- windowslinux_demo: Windows/Linux 试玩版`n- macos: macOS 版本"
    $form.Controls.Add($infoLabel)
    
    # 确定按钮
    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Location = New-Object System.Drawing.Point(250, 370)
    $okButton.Size = New-Object System.Drawing.Size(80, 30)
    $okButton.Text = "确定"
    $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $form.Controls.Add($okButton)
    $form.AcceptButton = $okButton
    
    # 取消按钮
    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Location = New-Object System.Drawing.Point(350, 370)
    $cancelButton.Size = New-Object System.Drawing.Size(80, 30)
    $cancelButton.Text = "取消"
    $cancelButton.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $form.Controls.Add($cancelButton)
    $form.CancelButton = $cancelButton
    
    $result = $form.ShowDialog()
    
    if ($result -eq [System.Windows.Forms.DialogResult]::OK -and $listBox.SelectedIndex -ge 0) {
        return $Assets[$listBox.SelectedIndex]
    }
    return $null
}

# ========== GUI: 选择游戏路径 ==========

function Show-GamePathDialog {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "选择游戏路径"
    $form.Size = New-Object System.Drawing.Size(650, 220)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false
    $form.MinimizeBox = $false
    
    $label = New-Object System.Windows.Forms.Label
    $label.Location = New-Object System.Drawing.Point(20, 15)
    $label.Size = New-Object System.Drawing.Size(600, 20)
    $label.Text = "请选择 DELTARUNE 游戏文件夹或 DELTARUNE.exe："
    $form.Controls.Add($label)
    
    $textBox = New-Object System.Windows.Forms.TextBox
    $textBox.Location = New-Object System.Drawing.Point(20, 45)
    $textBox.Size = New-Object System.Drawing.Size(500, 25)
    $textBox.Font = New-Object System.Drawing.Font("Consolas", 10)
    
    # 尝试自动检测Steam路径
    $steamPaths = @(
        "${env:ProgramFiles(x86)}\Steam\steamapps\common\DELTARUNE",
        "$env:ProgramFiles\Steam\steamapps\common\DELTARUNE",
        "$env:USERPROFILE\Steam\steamapps\common\DELTARUNE"
    )
    foreach ($sp in $steamPaths) {
        if (Test-Path $sp) {
            $textBox.Text = $sp
            break
        }
    }
    
    $form.Controls.Add($textBox)
    
    $browseButton = New-Object System.Windows.Forms.Button
    $browseButton.Location = New-Object System.Drawing.Point(530, 43)
    $browseButton.Size = New-Object System.Drawing.Size(80, 28)
    $browseButton.Text = "浏览..."
    $browseButton.Add_Click({
        $folderBrowser = New-Object System.Windows.Forms.FolderBrowserDialog
        $folderBrowser.Description = "选择 DELTARUNE 游戏文件夹"
        if ($textBox.Text -and (Test-Path $textBox.Text)) {
            $folderBrowser.SelectedPath = $textBox.Text
        }
        if ($folderBrowser.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
            $textBox.Text = $folderBrowser.SelectedPath
        }
    })
    $form.Controls.Add($browseButton)
    
    $exeButton = New-Object System.Windows.Forms.Button
    $exeButton.Location = New-Object System.Drawing.Point(20, 85)
    $exeButton.Size = New-Object System.Drawing.Size(200, 28)
    $exeButton.Text = "选择 DELTARUNE.exe"
    $exeButton.Add_Click({
        $fileDialog = New-Object System.Windows.Forms.OpenFileDialog
        $fileDialog.Filter = "DELTARUNE.exe|DELTARUNE.exe|可执行文件|*.exe"
        $fileDialog.Title = "选择 DELTARUNE.exe"
        if ($fileDialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
            $textBox.Text = $fileDialog.FileName
        }
    })
    $form.Controls.Add($exeButton)
    
    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Location = New-Object System.Drawing.Point(230, 130)
    $okButton.Size = New-Object System.Drawing.Size(80, 30)
    $okButton.Text = "确定"
    $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $form.Controls.Add($okButton)
    $form.AcceptButton = $okButton
    
    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Location = New-Object System.Drawing.Point(330, 130)
    $cancelButton.Size = New-Object System.Drawing.Size(80, 30)
    $cancelButton.Text = "取消"
    $cancelButton.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $form.Controls.Add($cancelButton)
    $form.CancelButton = $cancelButton
    
    $result = $form.ShowDialog()
    
    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        return $textBox.Text.Trim()
    }
    return $null
}

# ========== 路径处理 ==========

function Resolve-GamePath {
    param([string]$InputPath)
    
    if (-not $InputPath) { return $null }
    
    $InputPath = $InputPath.Trim()
    
    if (-not (Test-Path $InputPath)) {
        Show-ErrorDialog "路径不存在: $InputPath"
        return $null
    }
    
    $item = Get-Item $InputPath
    
    if ($item -is [System.IO.DirectoryInfo]) {
        # 是文件夹
        return $InputPath
    }
    elseif ($item -is [System.IO.FileInfo]) {
        # 是文件，返回所在目录
        return $item.DirectoryName
    }
    
    return $null
}

# ========== 下载补丁 ==========

function Download-Patch {
    param([string]$Url, [string]$FileName)
    
    $script:TempDir = Join-Path $env:TEMP "DeltarunePatch_$(Get-Random)"
    New-Item -ItemType Directory -Path $script:TempDir -Force | Out-Null
    
    $savePath = Join-Path $script:TempDir $FileName
    
    # 创建进度窗口
    $progressForm = New-Object System.Windows.Forms.Form
    $progressForm.Text = "下载补丁中..."
    $progressForm.Size = New-Object System.Drawing.Size(500, 150)
    $progressForm.StartPosition = "CenterScreen"
    $progressForm.FormBorderStyle = "FixedDialog"
    $progressForm.ControlBox = $false
    
    $progressLabel = New-Object System.Windows.Forms.Label
    $progressLabel.Location = New-Object System.Drawing.Point(20, 20)
    $progressLabel.Size = New-Object System.Drawing.Size(450, 20)
    $progressLabel.Text = "正在下载: $FileName"
    $progressForm.Controls.Add($progressLabel)
    
    $progressBar = New-Object System.Windows.Forms.ProgressBar
    $progressBar.Location = New-Object System.Drawing.Point(20, 55)
    $progressBar.Size = New-Object System.Drawing.Size(440, 25)
    $progressBar.Style = "Marquee"
    $progressBar.MarqueeAnimationSpeed = 30
    $progressForm.Controls.Add($progressBar)
    
    $progressForm.Show()
    $progressForm.Refresh()
    
    try {
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $Url -OutFile $savePath -UseBasicParsing -ErrorAction Stop
        $ProgressPreference = 'Continue'
        
        $progressForm.Close()
        
        if (Test-Path $savePath) {
            Write-Log "补丁下载完成: $savePath"
            return $savePath
        }
    }
    catch {
        $progressForm.Close()
        Write-Log "下载失败: $_"
        Show-ErrorDialog "下载补丁失败: $_"
        return $null
    }
    
    return $null
}

# ========== 解压补丁 ==========

function Extract-Patch {
    param([string]$ArchivePath, [string]$SevenZipPath)
    
    $extractDir = Join-Path $script:TempDir "extracted"
    New-Item -ItemType Directory -Path $extractDir -Force | Out-Null
    
    Write-Log "正在解压补丁..."
    
    try {
        $process = Start-Process -FilePath $SevenZipPath -ArgumentList "x `"$ArchivePath`" -o`"$extractDir`" -y" -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -ne 0) {
            throw "7z 解压失败，退出码: $($process.ExitCode)"
        }
        
        Write-Log "解压完成: $extractDir"
        return $extractDir
    }
    catch {
        Write-Log "解压失败: $_"
        Show-ErrorDialog "解压补丁失败: $_"
        return $null
    }
}

# ========== 备份功能 ==========

function Backup-File {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) { return $true }
    
    $dir = [System.IO.Path]::GetDirectoryName($FilePath)
    $name = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
    $ext = [System.IO.Path]::GetExtension($FilePath)
    
    # 寻找可用的备份名
    $backupNum = 0
    do {
        if ($backupNum -eq 0) {
            $backupPath = Join-Path $dir "$name.bak$ext"
        }
        else {
            $backupPath = Join-Path $dir "$name.bak$backupNum$ext"
        }
        $backupNum++
    } while (Test-Path $backupPath)
    
    try {
        Copy-Item -Path $FilePath -Destination $backupPath -Force -ErrorAction Stop
        $script:BackupList += [PSCustomObject]@{
            Original = $FilePath
            Backup = $backupPath
        }
        Write-Log "已备份: $FilePath -> $backupPath"
        return $true
    }
    catch {
        Write-Log "备份失败: $FilePath - $_"
        return $false
    }
}

# ========== 应用 xdelta 补丁 ==========

function Apply-XDeltaPatch {
    param(
        [string]$XDeltaPath,
        [string]$PatchFile,
        [string]$SourceFile,
        [string]$OutputFile
    )
    
    if (-not (Test-Path $SourceFile)) {
        Write-Log "源文件不存在: $SourceFile"
        $script:FailedOperations += [PSCustomObject]@{
            Type = "xdelta"
            File = $SourceFile
            Error = "源文件不存在"
        }
        return $false
    }
    
    # 先备份
    if (-not (Backup-File -FilePath $SourceFile)) {
        $script:FailedOperations += [PSCustomObject]@{
            Type = "backup"
            File = $SourceFile
            Error = "备份失败"
        }
        return $false
    }
    
    try {
        $process = Start-Process -FilePath $XDeltaPath -ArgumentList "-d -s `"$SourceFile`" `"$PatchFile`" `"$OutputFile`"" -Wait -PassThru -NoNewWindow -RedirectStandardOutput (Join-Path $env:TEMP "xdelta_out.txt") -RedirectStandardError (Join-Path $env:TEMP "xdelta_err.txt")
        
        if ($process.ExitCode -ne 0) {
            $err = Get-Content (Join-Path $env:TEMP "xdelta_err.txt") -ErrorAction SilentlyContinue
            throw "xdelta3 退出码: $($process.ExitCode) - $err"
        }
        
        Write-Log "补丁应用成功: $SourceFile"
        return $true
    }
    catch {
        Write-Log "补丁应用失败: $SourceFile - $_"
        $script:FailedOperations += [PSCustomObject]@{
            Type = "xdelta"
            File = $SourceFile
            Error = $_
        }
        return $false
    }
}

# ========== 复制资源文件 ==========

function Copy-ResourceFile {
    param(
        [string]$Source,
        [string]$Destination
    )
    
    if (-not (Test-Path $Source)) {
        Write-Log "源文件不存在: $Source"
        $script:FailedOperations += [PSCustomObject]@{
            Type = "copy"
            File = $Destination
            Error = "源文件不存在"
        }
        return $false
    }
    
    # 确保目标目录存在
    $destDir = [System.IO.Path]::GetDirectoryName($Destination)
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    
    # 如果目标已存在，先备份
    if (Test-Path $Destination) {
        if (-not (Backup-File -FilePath $Destination)) {
            $script:FailedOperations += [PSCustomObject]@{
                Type = "backup"
                File = $Destination
                Error = "备份失败"
            }
            return $false
        }
    }
    
    try {
        Copy-Item -Path $Source -Destination $Destination -Force -ErrorAction Stop
        Write-Log "复制成功: $Source -> $Destination"
        return $true
    }
    catch {
        Write-Log "复制失败: $Source -> $Destination - $_"
        $script:FailedOperations += [PSCustomObject]@{
            Type = "copy"
            File = $Destination
            Error = $_
        }
        return $false
    }
}

# ========== 安装补丁主流程 ==========

function Install-Patch {
    param(
        [string]$ExtractDir,
        [string]$GameDir,
        [string]$XDeltaPath,
        [string]$SevenZipPath
    )
    
    Write-Log "开始安装补丁..."
    Write-Log "游戏目录: $GameDir"
    Write-Log "补丁目录: $ExtractDir"
    
    $script:FailedOperations = @()
    
    # 1. 处理 xdelta 补丁文件
    $xdeltaFiles = Get-ChildItem -Path $ExtractDir -Filter "*.xdelta" -Recurse
    
    foreach ($xdeltaFile in $xdeltaFiles) {
        $patchName = $xdeltaFile.BaseName  # e.g., "chapter1" or "main"
        
        # 确定目标文件
        if ($patchName -eq "main") {
            $targetFile = Join-Path $GameDir "data.win"
        }
        else {
            # chapter1, chapter2, etc.
            $chapterDir = Join-Path $GameDir "$($patchName)_windows"
            $targetFile = Join-Path $chapterDir "data.win"
        }
        
        Write-Log "应用补丁: $($xdeltaFile.Name) -> $targetFile"
        
        if (Test-Path $targetFile) {
            $tempOutput = Join-Path $env:TEMP "patched_$(Get-Random).win"
            
            if (Apply-XDeltaPatch -XDeltaPath $XDeltaPath -PatchFile $xdeltaFile.FullName -SourceFile $targetFile -OutputFile $tempOutput) {
                # 替换原文件
                try {
                    Move-Item -Path $tempOutput -Destination $targetFile -Force
                    Write-Log "已替换: $targetFile"
                }
                catch {
                    Write-Log "替换失败: $targetFile - $_"
                    $script:FailedOperations += [PSCustomObject]@{
                        Type = "replace"
                        File = $targetFile
                        Error = $_
                    }
                    if (Test-Path $tempOutput) { Remove-Item $tempOutput -Force }
                }
            }
        }
        else {
            Write-Log "目标文件不存在，跳过: $targetFile"
            $script:FailedOperations += [PSCustomObject]@{
                Type = "xdelta"
                File = $targetFile
                Error = "目标文件不存在"
            }
        }
    }
    
    # 2. 复制资源文件 (lang, vid 等)
    $resourceDirs = Get-ChildItem -Path $ExtractDir -Directory
    
    foreach ($resDir in $resourceDirs) {
        if ($resDir.Name -match '^chapter\d+_windows$') {
            $targetChapterDir = Join-Path $GameDir $resDir.Name
            
            # 递归复制所有文件
            $allFiles = Get-ChildItem -Path $resDir.FullName -Recurse -File
            foreach ($file in $allFiles) {
                $relativePath = $file.FullName.Substring($resDir.FullName.Length + 1)
                $destPath = Join-Path $targetChapterDir $relativePath
                
                Copy-ResourceFile -Source $file.FullName -Destination $destPath
            }
        }
    }
    
    # 3. 处理根目录的文件 (如 t.txt, tree.txt 等，如果有需要)
    $rootFiles = Get-ChildItem -Path $ExtractDir -File | Where-Object { $_.Extension -ne ".xdelta" -and $_.Extension -ne ".7z" }
    # 这些通常是说明文件，不需要复制到游戏目录
    
    Write-Log "补丁安装流程完成"
    
    return ($script:FailedOperations.Count -eq 0)
}

# ========== 回滚功能 ==========

function Rollback-Changes {
    Write-Log "开始回滚更改..."
    
    $rollbackErrors = @()
    
    foreach ($backup in $script:BackupList) {
        try {
            if (Test-Path $backup.Backup) {
                Copy-Item -Path $backup.Backup -Destination $backup.Original -Force
                Write-Log "已恢复: $($backup.Original)"
            }
        }
        catch {
            Write-Log "恢复失败: $($backup.Original) - $_"
            $rollbackErrors += $backup.Original
        }
    }
    
    if ($rollbackErrors.Count -eq 0) {
        Write-Log "回滚完成"
        return $true
    }
    else {
        Write-Log "回滚完成，但有 $($rollbackErrors.Count) 个文件恢复失败"
        return $false
    }
}

# ========== 清理临时文件 ==========

function Clear-TempFiles {
    if ($script:TempDir -and (Test-Path $script:TempDir)) {
        try {
            Remove-Item -Path $script:TempDir -Recurse -Force
            Write-Log "临时文件已清理"
        }
        catch {
            Write-Log "清理临时文件失败: $_"
        }
    }
}

# ========== 主程序 ==========

function Main {
    Write-Log "========================================"
    Write-Log "Deltarune 汉化补丁安装器"
    Write-Log "========================================"
    
    # 1. 下载工具
    Write-Log "检查必要工具..."
    $xdeltaPath = Download-Tool -ToolName "xdelta3.exe" -DisplayName "xdelta3"
    $sevenZipDllPath = Download-Tool -ToolName "7z.dll" -DisplayName "7-Zip-Dll"
    $sevenZipPath = Download-Tool -ToolName "7z.exe" -DisplayName "7-Zip"
    
    if (-not $xdeltaPath) {
        Show-ErrorDialog "无法下载 xdelta3.exe，请检查网络连接或手动下载到脚本同目录。"
        return
    }

    if(-not $sevenZipDllPath) {
        Show-ErrorDialog "无法下载 7z.dll，请检查网络连接或手动下载到脚本同目录。"
        return
    }
    
    if (-not $sevenZipPath) {
        Show-ErrorDialog "无法下载 7z.exe，请检查网络连接或手动下载到脚本同目录。"
        return
    }
    
    # 2. 获取最新版本
    $release = Get-LatestRelease
    if (-not $release) { return }
    
    # 3. 选择补丁文件
    $assets = $release.assets | Where-Object { $_.name -match '\.7z$' }
    if (-not $assets -or $assets.Count -eq 0) {
        Show-ErrorDialog "未找到可用的补丁文件。"
        return
    }
    
    $selectedAsset = Show-AssetSelectionDialog -Assets $assets
    if (-not $selectedAsset) {
        Write-Log "用户取消了补丁选择"
        return
    }
    
    $script:SelectedAsset = $selectedAsset
    Write-Log "用户选择: $($selectedAsset.name)"
    
    # 4. 下载补丁
    $patchFile = Download-Patch -Url "https://ghfast.top/$($selectedAsset.browser_download_url)" -FileName $selectedAsset.name
    if (-not $patchFile) { return }
    
    # 5. 解压补丁
    $extractDir = Extract-Patch -ArchivePath $patchFile -SevenZipPath $sevenZipPath
    if (-not $extractDir) { Clear-TempFiles; return }
    
    # 6. 选择游戏路径
    $gamePathInput = Show-GamePathDialog
    if (-not $gamePathInput) {
        Write-Log "用户取消了路径选择"
        Clear-TempFiles
        return
    }
    
    $gameDir = Resolve-GamePath -InputPath $gamePathInput
    if (-not $gameDir) {
        Clear-TempFiles
        return
    }
    
    Write-Log "游戏目录: $gameDir"
    
    # 验证游戏目录
    $exePath = Join-Path $gameDir "DELTARUNE.exe"
    if (-not (Test-Path $exePath)) {
        $confirm = Show-ConfirmDialog -Message "在选定目录中未找到 DELTARUNE.exe。`n目录: $gameDir`n`n是否继续？" -Title "确认"
        if (-not $confirm) {
            Clear-TempFiles
            return
        }
    }
    
    # 7. 安装补丁
    $success = Install-Patch -ExtractDir $extractDir -GameDir $gameDir -XDeltaPath $xdeltaPath -SevenZipPath $sevenZipPath
    
    # 8. 处理结果
    if ($script:FailedOperations.Count -gt 0) {
        # 有失败的文件
        $failMsg = "以下操作失败:`n`n"
        foreach ($fail in $script:FailedOperations) {
            $failMsg += "[$($fail.Type)] $($fail.File)`n错误: $($fail.Error)`n`n"
        }
        $failMsg += "`n是否回滚所有更改（恢复到安装前的状态）？`n选择「是」回滚全部更改，`n选择「否」保留已成功的部分更改。"
        
        $shouldRollback = Show-ConfirmDialog -Message $failMsg -Title "部分操作失败"
        
        if ($shouldRollback) {
            Rollback-Changes
            Show-InfoDialog "已回滚所有更改。游戏文件已恢复到安装前的状态。" -Title "回滚完成"
        }
        else {
            $successList = @()
            foreach ($backup in $script:BackupList) {
                if ($backup.Original -notin ($script:FailedOperations | ForEach-Object { $_.File })) {
                    $successList += [System.IO.Path]::GetFileName($backup.Original)
                }
            }
            Show-InfoDialog "已保留成功的更改。`n`n成功修改的文件:`n$($successList -join "`n")`n`n失败的文件请查看之前的错误信息。`n`n注意：备份文件 (.bak) 仍保留在原地，如需手动恢复可以使用。" -Title "部分安装"
        }
    }
    else {
        Show-InfoDialog "汉化补丁安装成功！`n`n版本: $($release.tag_name)`n文件: $($selectedAsset.name)`n`n请启动游戏查看效果。" -Title "安装成功"
    }
    
    # 9. 清理
    Clear-TempFiles
    
    Write-Log "========================================"
    Write-Log "安装器退出"
    Write-Log "========================================"
}

# 运行主程序
Main