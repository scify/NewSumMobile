import {SelectTopicEnum} from "./selectTopicEnum";
export class CategoryUpdatedInfo {

  // category: The new category that was selected
  // topicToSelect: The topic that should be selected, once the topic retrieval is finished. Can be either NULL, or the last or first
  constructor(public category: string, public topicToSelect?: SelectTopicEnum) {
  }
}
