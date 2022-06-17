export class BaseTab {
  constructor(TabObject, OpenTabs) {
    this.Id = TabObject.Id;
    this.Caption = TabObject.Caption;
    this.Key = this.GenerateTabKey(TabObject.Id, OpenTabs);
    this.Items = TabObject.Items;
  }
  GenerateTabKey(TabID, OpenTabs) {
    let TabCount = 0;
    OpenTabs.forEach((Tab) => {
      if (Tab.Id == TabID) {
        TabCount = TabCount + 1;
      }
    });
    return `${TabID}${TabCount}`;
  }
}
