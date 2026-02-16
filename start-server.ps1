# 创建一个简单的HTTP服务器
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()

Write-Host "服务器已启动，访问地址: http://localhost:8000"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    try {
        # 获取请求的路径
        $path = $request.Url.LocalPath
        
        # 如果路径是根路径，返回index.html
        if ($path -eq "/") {
            $path = "/index.html"
        }
        
        # 构建文件路径
        $filePath = Join-Path -Path "C:\Users\你洲哥\source\repos\bubbleorca\cryptobox" -ChildPath $path.TrimStart("/")
        
        # 检查文件是否存在
        if (Test-Path -Path $filePath -PathType Leaf) {
            # 读取文件内容
            $content = Get-Content -Path $filePath -Raw
            
            # 设置响应内容类型
            switch ([System.IO.Path]::GetExtension($filePath)) {
                ".html" {
                    $response.ContentType = "text/html"
                }
                ".js" {
                    $response.ContentType = "text/javascript"
                }
                ".css" {
                    $response.ContentType = "text/css"
                }
                ".json" {
                    $response.ContentType = "application/json"
                }
                ".png" {
                    $response.ContentType = "image/png"
                }
                ".jpg" {
                    $response.ContentType = "image/jpeg"
                }
                ".jpeg" {
                    $response.ContentType = "image/jpeg"
                }
                ".gif" {
                    $response.ContentType = "image/gif"
                }
                ".svg" {
                    $response.ContentType = "image/svg+xml"
                }
                default {
                    $response.ContentType = "application/octet-stream"
                }
            }
            
            # 写入响应内容
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            # 文件不存在，返回404错误
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
    } catch {
        # 发生错误，返回500错误
        $response.StatusCode = 500
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("500 Internal Server Error")
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    
    # 关闭响应
    $response.Close()
}

# 停止服务器
$listener.Stop()
$listener.Close()
