#!/bin/bash

echo "🔧 Corrigiendo permisos de Homebrew..."
echo "Esto puede requerir tu contraseña de administrador."
echo ""

sudo chown -R yereth /usr/local/Cellar
sudo chown -R yereth /usr/local/var/homebrew
sudo chown -R yereth /usr/local/Homebrew
sudo chown -R yereth /usr/local/bin
sudo chown -R yereth /usr/local/share
sudo chown -R yereth /usr/local/lib/pkgconfig
sudo chown -R yereth /usr/local/etc/bash_completion.d
sudo chown -R yereth /usr/local/var/log
sudo chown -R yereth /usr/local/var/homebrew/locks

echo ""
echo "✅ Permisos corregidos"
echo ""
echo "Ahora puedes ejecutar:"
echo "  brew install cocoapods"
