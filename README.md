# Bitfinex External Helpdesk Service

[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](https://opensource.org/licenses/Apache-2.0)
![GitHub Release](https://img.shields.io/github/release/bitfinexcom/bfx-ext-helpdesk-js/all.svg)
![GitHub Release Date](https://img.shields.io/github/release-date/bitfinexcom/bfx-ext-helpdesk-js.svg)
![GitHub Last Commit](https://img.shields.io/github/last-commit/bitfinexcom/bfx-ext-helpdesk-js.svg)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/bitfinexcom/bfx-ext-helpdesk-js.svg)
![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)

<img align="right" width="15%" src="https://github.com/bitfinexcom/grenache/raw/master/logos/logo-square.png" />

- [Introduction](#introduction)
- [Copying](#copying)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Configure](#configure)
  - [grcServices](#grcservices)
  - [helpdesk](#helpdesk)
- [Starting](#starting)
  - [Signal handling](#signal-handling)
    - [SIGINT](#sigint)
    - [SIGTSTP](#sigtstp)
    - [SIGCONT](#sigcont)
- [Grenache API](#grenache-api)
  - [action: 'getDepartments'](#action-getdepartments)
  - [action: 'getTopics'](#action-gettopics)
  - [action: 'getTags'](#action-gettags)
  - [action: 'getAgents'](#action-getagents)
  - [action: 'getTeams'](#action-getteams)
- [Examples](#examples)
- [Maintainers](#maintainers)


## Introduction

The [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) is a [Grenache](https://github.com/bitfinexcom/grenache) worker that allows interaction with the internal helpdesk system over a [Grape](https://github.com/bitfinexcom/grenache-grape) network. Basically, the [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker acts as a proxy for the internal helpdesk's *RESTful API*, making it available over the DHT.

The scaffolding of the [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker has been created using [svc-js-cli](https://github.com/bitfinexcom/svc-js-cli) with [bfx-ext-js](https://github.com/bitfinexcom/bfx-ext-js) as service base.


## Copying

The [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) is free software. See the files whose names start with *LICENSE* (case-insensitive) for copying permission. The manuals, and some of the runtime libraries, are under different terms; see the individual source files for details.

Copyright years on [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) source files may be listed using range notation, e.g., 2017-2023, indicating that every year in the range, inclusive, is a copyrightable year that could otherwise be listed individually.


## Prerequisites

The [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) is a [Grenache](https://github.com/bitfinexcom/grenache) worker, hence it is essential that the machine on which it is launched is a member of a [Grape](https://github.com/bitfinexcom/grenache-grape) network. The [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker is developed in *Javascript* and requires a [Node.js®](https://nodejs.org/) runtime environment to be run, version *greater than* or *equal to* *v14.18.0*. Also, a package manager, such as [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/), is required in order to install all the dependencies.


## Install

In a nutshell, the shell command:

```bash
npm install --include='dev' --no-save
```

executed within the worker's main directory, will install all the required dependencies, suitable for all environments. You can also use [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/).


## Configure

Besides standard worker files, such as `common.json` where to set some general options and `grc.config.json` where to put the [Grape](https://github.com/bitfinexcom/grenache-grape) address (see [bfx-facs-grc](https://github.com/bitfinexcom/bfx-facs-grc) for more information), the *main* configuration file is `helpdesk.ext.json`.

Below are some details of the several sections that compose this configuration file; a look at the `helpdesk.ext.json.example` file, within the worker’s `config` directory, is also possible to get a good overview of its structure.

### grcServices

This is the standard worker array for declaring [Grenache](https://github.com/bitfinexcom/grenache) service names. The service name root assigned to this worker is `rest:ext:helpdesk`, however, a service for every single helpdesk has to be declared; most importantly, the fourth key of the service name has to match a property of the `helpdesk` object (see next section). This means that if two services are declared, such as `rest:ext:helpdesk:foo` and `rest:ext:helpdesk:bar:private`, the object in the next section needs to have at least the `foo` and `bar` properties set.

### helpdesk

In this section, details for every single helpdesk can be declared; as mentioned above, each key of the `helpdesk` object has to match the fourth key of the service name, while each item is an object with the following properties:

- `revision <string>` API revision to be used; one of *v1* or *v2*
- `publicKey <string>` API public key
- `privateKey <string>` API private key
- `baseUrl <string>` API base URL, without any path

With the exception of API revision, all of the above properties are to be considered mandatory; in case the API revision is invalid or missing, the worker will fallback to *v2*.


## Starting

To get started quickly, the shell command:

```bash
node worker.js --env=<environment> --wtype=wrk-ext-helpdesk-api --apiPort <port>
```

executed within the worker's main directory will bring it up and running. As a handy alternative, when a [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18)-like compliant shell is being used, a script, defined in the package's manifest file, can be invoked using, for example, the following command:

```bash
npm run worker
```

which, by default, runs the worker under the `development` environment, listening on port `7777`. These arguments can be customized using a `.npmrc` file in the project root (ie a sibling of `node_modules` and `package.json`). If the version of *npm* currently in use supports it, this command:

```bash
npm config --location 'project' set 'port=8888'
```

can be run to customize the port number, while this other one:

```bash
npm config --location 'project' set 'env=production'
```

to set the environment.

Although all of this is convenient and quick, it is not advisable to use it in a *production* environment; in that case, the use of a proper *process manager* (eg [systemd](https://systemd.io/), [pm2](https://pm2.keymetrics.io/), etc.) is recommended.

### Signal handling

The [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker handles several signals for different purposes; refer to the documentation of the operating system on which this worker is being executed to figure out how to send signals to a running process.

Only major signals are covered in this section; it is possible that a signal not listed here is handled by one of the [Grenache](https://github.com/bitfinexcom/grenache) framework components used as dependency by the [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker; refer to the documentation of the single components for a more in-depth view.

#### SIGINT

Send this signal to the [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker to initiate a graceful shutdown. As a handy shortcut, when using a [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18)-like compliant shell and a compatible [pkill](https://gitlab.com/procps-ng/procps/) command-line utility, a script, defined in the package's manifest file,  can be invoked using, for example, the following command:

```bash
npm run worker:stop
```

#### SIGTSTP

Send this signal to the [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker to *pause* the scheduler; all incoming requests will be rejected. As a handy shortcut, when using a [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18)-like compliant shell and a compatible [pkill](https://gitlab.com/procps-ng/procps/) command-line utility, a script, defined in the package's manifest file,  can be invoked using, for example, the following command:

```bash
npm run worker:pause
```

#### SIGCONT

Send this signal to the [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker to *resume* the scheduler; all incoming requests will be accepted. As a handy shortcut, when using a [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18)-like compliant shell and a compatible [pkill](https://gitlab.com/procps-ng/procps/) command-line utility, a script, defined in the package's manifest file,  can be invoked using, for example, the following command:

```bash
npm run worker:resume
```


## Grenache API

All available actions are documented in this section; to better describe every action and assist the reader, the following type conventions will be used:

- `uint_t` a *positive*, *non-decimal* number
- `string_t` a *non-empty*, *trimmed* string
- `int_t` a *non-negative*, *non-decimal* number
- `sort_t` a *trimmed*, *case-insensitve* string whose only possible values are *ASC* and *DESC*
- `bool_t` a boolean where `1`, `"true"`, `"1"`, `"on"` and `true` will be evaluated as *true*, while `0`, `"false"`, `"0"`, `"off"` and `false` will be treated as *false*

### action: 'getDepartments'

Get departments list ordered by name in ascending order. All of the following arguments and properties are to be considered optional.

  - `args <Array>`
    - `0 <Object>`
      - `limit <uint_t>` maximum number of results
      - `offset <uint_t>` offset of the first result to return
      - `sort <sort_t>` sort direction
      - `pid <uint_t>` department parent identifier
      - `name <string_t>` a *single-line*, *case-insensitve* string that has to be contained in the department name (no more than *128 characters*)

**Response:**

  - `<Array>` The departments list. Each list item will have the following properties:
    - `id <uint_t>` department identifier
    - `name <string_t>` department name

**Example Response:**

```js
[
  {
    "id": 31337,
    "name": "foobar"
  }
]
```

### action: 'getTopics'

Get topics list ordered by name in ascending order. All of the following arguments and properties are to be considered optional.

  - `args <Array>`
    - `0 <Object>`
      - `limit <uint_t>` maximum number of results
      - `offset <uint_t>` offset of the first result to return
      - `sort <sort_t>` sort direction
      - `is_active <bool_t>` whether or not topic is active
      - `name <string_t>` a *single-line*, *case-insensitve* string that has to be contained in the topic name (no more than *32 characters*)

**Response:**

  - `<Array>` The topics list. Each list item will have the following properties:
    - `name <string_t>` topic name
    - `id <uint_t>` topic identifier
    - `pid <int_t>` topic parent identifier if it exists, *0* otherwise

**Example Response:**

```js
[
  {
    "name": "foobar",
    "id": 31337,
    "pid": 1337
  }
]
```

### action: 'getTags'

Get tags list ordered as configured on the helpdesk backend in ascending order. All of the following arguments and properties are to be considered optional.

> **Note:** tags can be quite a lot; whenever possible, make use of the filters below to minimize the number of *REST* requests (and thereby decrease the overall response time).

  - `args <Array>`
    - `0 <Object>`
      - `limit <uint_t>` maximum number of results
      - `offset <uint_t>` offset of the first result to return
      - `sort <sort_t>` sort direction
      - `is_active <bool_t>` whether or not tag is active
      - `name <string_t>` a *single-line*, *case-insensitve* string that has to be contained in the tag name (no more than *255 characters*)

**Response:**

  - `<Array>` The tags list. Each list item will have the following properties:
    - `id <uint_t>` tag identifier
    - `name <string_t>` tag name

**Example Response:**

```js
[
  {
    "id": 31337,
    "name": "foobar"
  }
]
```

### action: 'getAgents'

Get agents list ordered by username in ascending order. All of the following arguments and properties are to be considered optional.

  - `args <Array>`
    - `0 <Object>`
      - `limit <uint_t>` maximum number of results
      - `offset <uint_t>` offset of the first result to return
      - `sort <sort_t>` sort direction
      - `is_locked <bool_t>` whether or not agent is locked
      - `on_vacation <bool_t>` whether or not agent is on vacation
      - `department_id <uint_t>` department identifier associated with the agent
      - `name <string_t>` a *single-line*, *case-insensitve* string that has to be contained in the agent name (no more than *64 characters*)

**Response:**

  - `<Array>` The agents list. Each list item will have the following properties:
    - `username <string_t>` agent username
    - `email <string_t>` agent e-mail address
    - `id <uint_t>` agent identifier

**Example Response:**

```js
[
  {
    "username": "foobar",
    "email": "foobar@example.com",
    "id": 31337
  }
]
```

### action: 'getTeams'

Get teams list ordered by name in ascending order. All of the following arguments and properties are to be considered optional.

  - `args <Array>`
    - `0 <Object>`
      - `limit <uint_t>` maximum number of results
      - `offset <uint_t>` offset of the first result to return
      - `sort <sort_t>` sort direction
      - `is_empty <bool_t>` whether or not team is empty
      - `is_active <bool_t>` whether or not team is active
      - `name <string_t>` a *single-line*, *case-insensitve* string that has to be contained in the team name (no more than *125 characters*)

**Response:**

  - `<Array>` The teams list. Each list item will have the following properties:
    - `name <string_t>` team name
    - `id <uint_t>` team identifier
    - `active_members <int_t>` number of active team members

**Example Response:**

```js
[
  {
    "name": "foobar",
    "id": 31337,
    "active_members": 1337
  }
]
```


## Examples

Refer to the [example.js](example.js) file within the project main directory for an example of using the *API* provided by the [*bfx-ext-helpdesk-js*](https://github.com/bitfinexcom/bfx-ext-helpdesk-js) worker.


## Maintainers

Current maintainers:

- [Davide Scola](https://github.com/davide-scola)
