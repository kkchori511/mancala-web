# 같은 네트워크에서 게임을 열어 보기 위한 개발용 서버. 게임 파일만 제공한다.
import http.server, socketserver, sys, os
ALLOWED = ('/', '/index.html', '/css/', '/src/', '/assets/')
class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0]
        if path == '/' or any(path.startswith(p) for p in ALLOWED[1:]):
            if '..' not in path:
                return super().do_GET()
        self.send_error(404)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def log_message(self, *a): pass
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8770
socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('0.0.0.0', port), H) as s:
    s.serve_forever()
