# @jych/disallow

A CLI command to help ensure you don't include disallowed packages in your project.

By providing a list of packages that you don't allow to be used in your project, you can ensure they are not added to
either dependencies or devDependencies. If any disallowed packages are found, they will be logged and the command will
exit.

## usage

Run `disallow` to check your project for disallowed packages.

From your shell:

```shell
disallow --package ./package.json --list ./disallow-list.json
```

From your package.json scripts:

```shell
"scripts": {
  "lint": "disallow --package ./package.json --list ./disallow-list.json"
}
```

Run `disallow --help` for a full help page.

## disallow list

Disallowed packages are provided in a JSON file, with the format:

```JSON
{
  "disallow": [ "packageA", "packageB" ]
}
```
