# 🔧 Solución: Permisos de Homebrew

## El Problema

Homebrew tiene problemas de permisos. Necesitas cambiar la propiedad de las carpetas.

## Solución Rápida

Ejecuta este comando en tu terminal:

```bash
sudo chown -R yereth /usr/local/Homebrew /usr/local/bin /usr/local/etc/bash_completion.d /usr/local/lib/pkgconfig /usr/local/share /usr/local/share/aclocal /usr/local/share/doc /usr/local/share/info /usr/local/share/locale /usr/local/share/man /usr/local/share/man/man1 /usr/local/share/man/man3 /usr/local/share/man/man5 /usr/local/share/man/man7 /usr/local/share/zsh /usr/local/share/zsh/site-functions /usr/local/var/homebrew/locks /usr/local/var/log
```

Luego intenta instalar CocoaPods nuevamente:

```bash
brew install cocoapods
```

## Alternativa: Instalar CocoaPods con rbenv

Si prefieres evitar los permisos de Homebrew:

```bash
# 1. Instalar rbenv
brew install rbenv ruby-build

# 2. Instalar Ruby 3.3.0
rbenv install 3.3.0
rbenv global 3.3.0

# 3. Configurar rbenv
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
source ~/.zshrc

# 4. Verificar Ruby
ruby --version

# 5. Instalar CocoaPods
gem install cocoapods
```

## Después de Instalar CocoaPods

```bash
cd /Users/yereth/Desktop/myRutine/mobile/ios
pod install
open myRutine.xcworkspace
```
