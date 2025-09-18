import json
from pathlib import Path

p = Path("backend/credentials.json")
if not p.exists():
    print("Arquivo credentials.json não encontrado neste diretório.")
    raise SystemExit(1)

# lê JSON
text = p.read_text(encoding="utf-8")
data = json.loads(text)

if "private_key" not in data:
    print("Campo 'private_key' não encontrado.")
    raise SystemExit(1)

pk = data["private_key"]

# normaliza CRLF para LF, depois substitui LFs por \n literal
pk_normal = pk.replace("\r\n", "\n").replace("\r", "\n")
pk_escaped = pk_normal.replace("\n", "\\n")

data["private_key"] = pk_escaped

# escreve de volta com identação legível (não altera outros campos)
p.write_text(json.dumps(data, ensure_ascii=False, indent=4), encoding="utf-8")
print("Feito: quebras dentro de private_key substituídas por \\n. Backup em credentials.json.bak")
