export class TopicsUpdatedInfo {
  constructor(public category: string, public topics: any, public topicsCount: number, public hotTopicsCount: number, public shouldUpdateTabsSelection: boolean) {}
}
