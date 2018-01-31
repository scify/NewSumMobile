export class ApplicationSettings {

  constructor (public activeTheme:string,
               public language:string,
               public sources:Array<string>,
               public categories:Array<string>,
               public favoriteCategory:string) {}
}


