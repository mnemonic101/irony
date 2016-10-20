# typescript-mvc [![Build status](https://travis-ci.org/mnemonic101/typescript-mvc.svg)](https://travis-ci.org/mnemonic101/typescript-mvc)
**A convention based MVC Framework for TypeScript**

This framework supports you writing Clean Code by implementing some common pattern like AOP, IoC and Convention Over Configuration.

## Prerequisites

You will need [`nodejs`](https://nodejs.org/), at least v4.4.7.

This framework is intended to work with [`TypeScript`](https://www.typescriptlang.org/) as programming language.
```npm install typescript```

## Configuration

The following TypeScript compilation options are required in your tsconfig.json file:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Usage

### Server

To create a new web application, you need a server.
Create a `server.ts` file containing the following lines:  

```typescript
import {WebServer} from "typescript-mvc";

class Server extends WebServer { }

Server.start();
```
Place the server file in the project root. 

After transpiling, the following command will start your new web server application: 
 
```$ node server.js```

### Controller

To handle http requests to your web application, you need a controller.
Create a `helloworld.ts` file containing the following lines:  

```typescript
import {Controller, Route} from "typescript-mvc";

export class HelloWorldController extends Controller {

  @Route("/")
  public index(): void {

    this.context.logger.log("Hello World!");

    this.response.writeHead(200, { "Content-Type": "text/plain" });
    this.response.end("Hello World!");
  }
}
```
Place the controller file in a folder called ***controller*** and everything will be wired up automatically.

### Settings

You can change default values that are not easy to define by convention, with custom settings.
Create a `settings.json` file that could contain the following lines:  

```json
{
  "protocol": "http",
  "hostname": "127.0.0.1",
  "port": 80,
  "root": "/"
}
```
Place the settings file in your project root for now. 

## Development

### Compile Source

```$ npm run build```

### Publish NPM Package

```$ npm version patch|minor|major```

## Thanksgiving

I would like to thank [thiagobustamante](https://github.com/thiagobustamante) for his realy inspiring work on [typescript-mvc](https://github.com/thiagobustamante/typescript-rest)!
This project started as a simple fork of [typescript-mvc](https://github.com/thiagobustamante/typescript-rest). I realy liked it, but then I started refactoring the code. I wanted it to be more modular and convention besed. Also I wanted to use the [typescript-ioc](https://github.com/thiagobustamante/typescript-ioc), which at the point of forking where not easily manageable. Evenmore at this time the code was written for ES6. In the end there was not much that I could have been back-merged such easily.

## License

[MIT](https://github.com/mnemonic101/typescript-mvc/blob/master/LICENSE)