# autodoc-sass-less

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->

- [Usage](#usage)
<!-- tocstop -->

# Commands

```
COMMANDS
  help     Display help for stylesdoc.
  parse    Parse style files.
  version  Package version.
```

## stylesdoc parse
```
> stylesdoc parse --help

USAGE
  $ stylesdoc parse [PATHS] [-c <value>] [-d <value>] [-t <value>] [--debug | -s] [--grouped [--to-json | --to-html | --to-md]]

ARGUMENTS
  PATHS  paths to source directories

FLAGS
  -c, --config=<value>  [default: C:\Work\autodoc\settings.json] Path to JSON configuration file
  -d, --dest=<value>    Parsing destination (file path when saving JSON data, folder path when generating web site)
  -s, --silent          Supress logs output except errors
  -t, --theme=<value>   Color theme for website
  --debug               Display debug information
  --grouped             Group resulting items by group name and element type
  --to-html             Parse input files into WEB format
  --to-json             Parse input files into JSON format
  --to-md               Parse input files into Markdown format

DESCRIPTION
  Parse style files.

EXAMPLES
  $ stylesdoc parse example_directory_path
```



# Usage for QA

<!-- usage -->

Prerequisites

- Node.js should be installed (version >= 16.14.0) https://nodejs.org/en/download/

```sh-session
$ npm i
$ npm run build
$ npm link
$ autodoc-sass-less COMMAND
running command...
$ autodoc-sass-less (--version)
autodoc-sass-less/0.0.0 darwin-x64 node-v18.4.0
$ autodoc-sass-less --help [COMMAND]
USAGE
  $ autodoc-sass-less COMMAND
...
```

<!-- usagestop -->


# Конфигурация с помощью settings.json
По умолчанию, конфигурационный файл `settings.json` ожидается в корневой папке приложения.\
Но можно использовать файл из другого расположения, указав путь к нему c помощью флагов `-c`/`--config`. 

Например: 
- `stylesdoc parse example -c с:\\temp\\my_custom_config.json`,
- `autodoc-sass-less parse example --config с:\\temp\\my_custom_config.json`


Детальное [описание конфигурации см. здесь](./doc/settings.md)
