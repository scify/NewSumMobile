# NewSum mobile

[NewSum](http://www.scify.gr/site/en/projects/completed/newsum) is a summarization application developed for getting summaries from various news sources.

This repository contains the code of the mobile application (build with [Ionic framework](https://ionicframework.com/)).
News are fetched by consuming a free SOAP service defined by SciFY. 

## Screeshots
<p align="center">
<img src="https://github.com/scify/NewSumMobile/blob/master/docs/screenshots/topics-page.png?raw=true" width="200">
<img src="https://github.com/scify/NewSumMobile/blob/master/docs/screenshots/topic-page.png?raw=true" width="200">
<img src="https://github.com/scify/NewSumMobile/blob/master/docs/screenshots/menu.png?raw=true" width="200">
<img src="https://github.com/scify/NewSumMobile/blob/master/docs/screenshots/settings.png?raw=true" width="200">
</p>

  
# How to build

This project was built using the following versions of nodejs and npm:

```$xslt
$ node -v
v8.9.1

$ npm -v
5.6.0
```

It is very easy to install multiple versions of nodejs and npm, by using [Node Version Manager (nvm)](https://github.com/creationix/nvm).

## Install project dependencies:

```bash
$ npm install -g ionic cordova
$ npm install
$ ionic serve
```

## Execution

```bash
$ ionic cordova platform add android
$ ionic cordova emulate android
```


