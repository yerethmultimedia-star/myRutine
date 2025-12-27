# 📱 Configuración del Logo - myRutine

El logo de la aplicación se ha configurado usando `logo.png` (1024x1024px).

## ✅ Lo que se ha implementado:

1. **Logo copiado a assets**
   - ✅ `mobile/src/assets/images/logo.png` - Logo principal (376KB, 1024x1024px)

2. **Componente Logo creado**
   - ✅ `mobile/src/components/Logo.tsx` - Componente reutilizable
   - Props disponibles: `width`, `height`, `style`, `resizeMode`

3. **Logo integrado en LoginScreen**
   - ✅ Logo visible en la pantalla de inicio de sesión
   - ✅ Tamaño: 100x100 píxeles
   - ✅ Integrado con el sistema de tema (modo claro/oscuro)

## 🎨 Uso del Logo en Componentes

```tsx
import Logo from '../components/Logo';

// Uso básico (tamaño por defecto: 120x120)
<Logo />

// Con tamaño personalizado
<Logo width={150} height={150} />

// Con estilo personalizado
<Logo 
  width={120} 
  height={120} 
  style={{ marginBottom: 20 }}
  resizeMode="contain"  // 'contain' | 'cover' | 'stretch' | 'center'
/>
```

## 📱 Iconos de la App (iOS/Android)

Para usar el logo como icono de la app, consulta las herramientas recomendadas en la documentación completa.
