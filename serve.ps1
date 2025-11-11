<#
.SYNOPSIS
  Serve este site estático localmente e abre o navegador.

.DESCRIPTION
  script simples para Windows PowerShell. Detecta 'python' ou 'python3', inicia
  um servidor HTTP em uma porta especificada e grava o PID em 'serve.pid' para
  permitir parada posterior. Use -Stop para parar o servidor.

.EXAMPLES
  # iniciar servidor na porta 8000 (padrão)
  .\serve.ps1

  # iniciar servidor na porta 8080
  .\serve.ps1 -Port 8080

  # parar servidor (usa serve.pid)
  .\serve.ps1 -Stop
#>

param(
    [int]$Port = 8000,
    [switch]$Stop
)

function Stop-Server {
    if (Test-Path .\serve.pid) {
        try {
            $pid = Get-Content .\serve.pid | Select-Object -First 1
            Write-Host "Parando processo PID $pid ..."
            Stop-Process -Id $pid -ErrorAction SilentlyContinue
            Remove-Item .\serve.pid -ErrorAction SilentlyContinue
            Write-Host "Servidor parado."
        } catch {
            Write-Warning "Falha ao parar o servidor: $_"
        }
    } else {
        Write-Host "Arquivo serve.pid não encontrado. Nenhum servidor gerenciado por este script parece estar em execução."
    }
}

function Start-Server {
    # detectar python
    $py = (Get-Command python -ErrorAction SilentlyContinue).Path
    if (-not $py) { $py = (Get-Command python3 -ErrorAction SilentlyContinue).Path }

    if (-not $py) {
        Write-Error "Python não encontrado no PATH. Instale Python ou use a extensão Live Server do VS Code."
        return
    }

    if (Test-Path .\serve.pid) {
        Write-Warning "serve.pid encontrado. Parece que o servidor já foi iniciado por este script. Use -Stop para pará-lo primeiro.";
        return
    }

    Write-Host "Iniciando servidor com: $py -m http.server $Port"
    $proc = Start-Process -FilePath $py -ArgumentList ('-m','http.server',$Port) -WindowStyle Hidden -PassThru

    if ($proc -and $proc.Id) {
        $proc.Id | Out-File -FilePath .\serve.pid -Encoding ascii
        Start-Sleep -Milliseconds 500
        $url = "http://localhost:$Port"
        Write-Host "Servidor iniciado em $url (PID $($proc.Id)). Abrindo navegador..."
        try { Start-Process $url } catch { Write-Warning "Não foi possível abrir o navegador automaticamente: $_" }
        Write-Host "Para parar: .\serve.ps1 -Stop"
    } else {
        Write-Error "Falha ao iniciar o servidor HTTP."
    }
}

if ($Stop) { Stop-Server } else { Start-Server }
