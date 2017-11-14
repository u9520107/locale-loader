# Locale Loader
[![Build Status](https://travis-ci.org/u9520107/locale-loader.svg?branch=master)](https://travis-ci.org/u9520107/locale-loader)

Simple locale loader for webpack.

Sample File Structure:
---
```
    --/src
        |--/i18n
             |--en-US.js
             |--fr-FR.js
             |--localeLoader.js
```

Locale Files
---
Can be js or json, as long as it can be imported as an object.
Does not support nested structures.


```javascript
import constants from './constants';

export default {
    title: 'Hello World',
    [constants.fetchError]: 'Fetch Error',
    icuCompliant: 'Greetings, {name}!',
    handleEscapedBraces: 'Escape braces with single quote: \'{foo}\'',
};
```

Loader File
---
Loader files should be a js file starting with the following comment.
```javascript
/* loadLocale */
```
The webpack loader will generate necessary code (in es6) in compiling process.
Each locale will be placed into separate bundles.

If there is a need to not separate the bundles, the following comment can be used instead.
```javascript
/* loadLocale noChunk */
```
