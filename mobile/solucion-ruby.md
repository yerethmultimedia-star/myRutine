# 🔧 Solución: Problema con Versión de Ruby

## El Problema

Tu versión de Ruby (2.6.10) es antigua. CocoaPods requiere Ruby >= 3.1.0.

## Solución Recomendada: Usar Homebrew

La forma más fácil es instalar CocoaPods con Homebrew:

```bash
brew install cocoapods
```

Homebrew manejará las dependencias automáticamente.

## Alternativa 1: Actualizar Ruby del Sistema

Si prefieres actualizar Ruby:

```bash
# Instalar Ruby más reciente
brew install ruby

# Agregar al PATH
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verificar versión
ruby --version

# Instalar CocoaPods
gem install cocoapods
```

## Alternativa 2: Usar rbenv (Gestor de Versiones)

Si quieres gestionar múltiples versiones de Ruby:

```bash
# 1. Instalar rbenv
brew install rbenv ruby-build

# 2. Instalar Ruby 3.3.0
rbenv install 3.3.0
rbenv global 3.3.0

# 3. Configurar rbenv
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
source ~/.zshrc

# 4. Verificar
ruby --version

# 5. Instalar CocoaPods
gem install cocoapods
```

## Después de Instalar CocoaPods

Una vez que CocoaPods esté instalado:

```bash
cd /Users/yereth/Desktop/myRutine/mobile/ios
pod install
open myRutine.xcworkspace
```

## Recomendación

**Usa la primera opción (Homebrew)** - Es la más simple y no requiere modificar la versión de Ruby del sistema.
