$process = Start-Process npx -ArgumentList "-y", "localtunnel", "--port", "5000" -RedirectStandardOutput "backend_tunnel.txt" -PassThru
Start-Sleep -Seconds 10
Get-Content "backend_tunnel.txt"
