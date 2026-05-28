# 12 - Linux Essentials: permisos y ejecutables

## Objetivo

Practicar permisos basicos de Linux y entender como afectan a scripts reales del laboratorio.

El foco es reconocer permisos, interpretar `rwx` y diferenciar permisos del filesystem de permisos guardados por Git.

## Conceptos clave

Linux usa permisos para tres grupos:

```text
u -> user/owner
g -> group
o -> others
```

Y tres permisos principales:

```text
r -> read
w -> write
x -> execute
```

Ejemplo:

```text
-rwxr-xr-x
```

Significa:

```text
owner  -> read, write, execute
group  -> read, execute
others -> read, execute
```

## Parte 1: mirar permisos

Desde la raiz del proyecto:

```bash
ls -lah scripts
find scripts -maxdepth 1 -type f -name "*.sh" -printf "%M %u %g %p\n"
```

Anota:

- Que scripts aparecen.
- Que permisos ves.
- Quien es el owner.
- Que grupo tienen.

## Parte 2: revisar permisos en Git

Git guarda contenido de archivos y tambien un bit importante: si el archivo es ejecutable.

```bash
git ls-files --stage scripts/*.sh
```

Modos comunes:

```text
100644 -> archivo normal, no ejecutable
100755 -> archivo ejecutable
```

Anota:

- Que modo tienen los scripts.
- Si coincide con lo que muestra `ls -lah`.

## Parte 3: entender WSL y `/mnt/c`

Cuando trabajas desde WSL sobre una carpeta de Windows, como:

```text
/mnt/c/Users/...
```

puede pasar que `ls -lah` muestre permisos muy abiertos, por ejemplo:

```text
rwxrwxrwx
```

Eso no siempre significa que Git vaya a guardar esos permisos.

Para saber que se va a versionar, revisa:

```bash
git ls-files --stage scripts/*.sh
```

## Parte 4: marcar scripts como ejecutables en Git

Si un script tiene shebang, por ejemplo:

```bash
#!/usr/bin/env sh
```

entonces puede tener sentido versionarlo como ejecutable.

Comando:

```bash
git update-index --chmod=+x scripts/check-health.sh
```

Para varios scripts:

```bash
git update-index --chmod=+x scripts/*.sh
```

Luego validar:

```bash
git diff --summary
git ls-files --stage scripts/*.sh
```

Resultado esperado:

```text
mode change 100644 => 100755 scripts/check-health.sh
```

## Parte 5: ejecutar scripts

Probar un script directamente:

```bash
./scripts/check-health.sh
```

Si aparece:

```text
Permission denied
```

posibles causas:

- El archivo no tiene permiso de ejecucion.
- El bit ejecutable no esta guardado en Git.
- Estas en un filesystem montado con reglas especiales.

Alternativa temporal:

```bash
sh scripts/check-health.sh
```

Esto ejecuta el script con `sh`, aunque el archivo no tenga bit ejecutable.

## Parte 6: comandos de practica

```bash
ls -lah scripts/check-health.sh
stat scripts/check-health.sh
git ls-files --stage scripts/check-health.sh
git diff --summary
```

Anota:

- Que dice `ls`.
- Que dice `stat`.
- Que dice Git.
- Cual de esos datos importa para otro usuario que clone el repo.

## Criterio de exito

La practica esta completa si puedes explicar:

- Que significa `rwx`.
- Que diferencia hay entre owner, group y others.
- Que diferencia hay entre `100644` y `100755`.
- Por que WSL sobre `/mnt/c` puede mostrar permisos distintos.
- Como marcar un script como ejecutable en Git.
- Como ejecutar un script aunque no tenga bit ejecutable.

## Resumen mental

```text
ls -lah                 -> ver permisos visibles
stat archivo            -> ver detalles del archivo
chmod +x archivo        -> dar permiso de ejecucion en filesystem
git update-index --chmod=+x archivo -> guardar ejecutable en Git
git ls-files --stage    -> ver modo guardado por Git
100644                  -> normal
100755                  -> ejecutable
```
