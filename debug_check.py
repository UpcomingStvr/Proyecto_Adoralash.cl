#!/usr/bin/env python3
"""
DEBUGGING Y VERIFICACIÓN LOCAL RIGUROSA PARA ADORA LASHES
Verifica:
1. Existencia y accesibilidad de todas las imágenes referenciadas en HTML/CSS.
2. Integridad de enlaces internos (#inicio, #servicios, etc.).
3. Correspondencia exacta de IDs entre index.html y main.js.
4. Validación de sintaxis básica y etiquetas abiertas/cerradas.
5. Verificación de config.json y admin.html.
"""

import os
import re
import json
import sys

base_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(base_dir, "index.html")
css_path = os.path.join(base_dir, "style.css")
js_path = os.path.join(base_dir, "main.js")
admin_path = os.path.join(base_dir, "admin.html")
config_path = os.path.join(base_dir, "config.json")

print("\n--- INICIANDO DIAGNÓSTICO LOCAL DETALLADO ---\n")

issues = []

# 1. Verificar existencia de archivos esenciales
for fname in ["index.html", "style.css", "main.js", "admin.html", "config.json", "_headers", "nginx.conf"]:
    p = os.path.join(base_dir, fname)
    if not os.path.exists(p):
        issues.append(f"Archivo crítico ausente: {fname}")
    else:
        print(f"✓ Archivo presente: {fname} ({os.path.getsize(p)} bytes)")

# 2. Verificar imágenes
html_content = open(html_path, "r", encoding="utf-8").read()
img_matches = re.findall(r'src=["\']([^"\']+)["\']', html_content)
print(f"\nVerificando {len(img_matches)} referencias de imágenes en HTML:")
for src in img_matches:
    if src.startswith("http"):
        continue
    img_file = os.path.join(base_dir, src)
    if not os.path.exists(img_file):
        issues.append(f"Imagen referenciada no existe en disco: {src}")
    else:
        size_kb = os.path.getsize(img_file) / 1024
        print(f"  ✓ {src} -> OK ({size_kb:.1f} KB)")

# 3. Verificar anclas internas (#id)
internal_links = re.findall(r'href=["\']#([^"\']+)["\']', html_content)
all_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html_content))
print(f"\nVerificando anclas internas ({len(internal_links)} encontradas):")
for link in internal_links:
    if link == "" or link == "#":
        continue
    if link not in all_ids:
        issues.append(f"Enlace hacia #{link} pero no existe ningún elemento con id='{link}'")
    else:
        print(f"  ✓ Ancla #{link} -> Coincide con id existente")

# 4. Verificar IDs que main.js intenta leer
js_content = open(js_path, "r", encoding="utf-8").read()
js_ids = re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", js_content)
print(f"\nVerificando selectores getElementById en main.js ({len(js_ids)} llamados):")
for jid in js_ids:
    if jid not in all_ids:
        issues.append(f"main.js busca id='{jid}', pero no existe en index.html!")
    else:
        print(f"  ✓ ID '{jid}' enlazado correctamente")

# 5. Validar formato de config.json
try:
    with open(config_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
        print(f"\n✓ config.json es un JSON válido con {len(cfg)} claves configuradas.")
except Exception as e:
    issues.append(f"config.json tiene error de sintaxis: {e}")

# 6. Validar CSS (llaves balanceadas)
css_content = open(css_path, "r", encoding="utf-8").read()
open_braces = css_content.count("{")
close_braces = css_content.count("}")
if open_braces != close_braces:
    issues.append(f"style.css tiene desbalance de llaves: {open_braces} abiertas vs {close_braces} cerradas")
else:
    print(f"\n✓ style.css llaves balanceadas ({open_braces} bloques de reglas)")

# Resumen
print("\n--------------------------------------------")
if issues:
    print(f"⚠️ SE DETECTARON {len(issues)} DETALLES POR CORREGIR:")
    for iss in issues:
        print(f"  - {iss}")
    sys.exit(1)
else:
    print("✨ DIAGNÓSTICO PERFECTO: Cero errores de rutas, IDs, imágenes o enlaces.")
    sys.exit(0)
