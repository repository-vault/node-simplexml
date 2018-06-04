[![Build Status](https://travis-ci.org/131/simplexml.svg?branch=master)](https://travis-ci.org/131/simplexml)
[![Coverage Status](https://coveralls.io/repos/github/131/simplexml/badge.svg?branch=master)](https://coveralls.io/github/131/simplexml?branch=master)
[![Version](https://img.shields.io/npm/v/simplexml.svg)](https://www.npmjs.com/package/simplexml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Code style](https://img.shields.io/badge/code%2fstyle-ivs-green.svg)](https://www.npmjs.com/package/eslint-plugin-ivs)


# Motivation
Few (legacy) project of mine are using simpleXML (from PHP) as config file format.
This module mimics php SimpleXML behavior (access & iterators)


# API


```
const SimpleXML = require('simplexml');

var config = simplexml.load_file("some/file.json");


//per simplexml design ; nodes are created per access
console.log("Current value is ", config.some.node.that.might.not.even.exists);


for(var child of config.some.node.children_of_same_type) {
    //with iterator support
}

```


# Credits 
* [131](https://github.com/131)
