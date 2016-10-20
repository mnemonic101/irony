# typescript-mvc [![Build status](https://travis-ci.org/mnemonic101/typescript-mvc.svg)](https://travis-ci.org/mnemonic101/typescript-mvc)
**A convention based MVC Framework for TypeScript**

This framework supports you writing Clean Code by implementing some common pattern like AOP, IoC and Convention Over Configuration.

## Configuration

The following TypeScript compilation options are required in your tsconfig.json file:

```typescript
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

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