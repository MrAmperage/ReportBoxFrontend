export class BaseTab {
  constructor(TabObject, OpenTabs) {
    this.Id = TabObject.Id;
    this.Caption = TabObject.Caption;
    this.Key = this.GenerateTabKey(TabObject.Id, OpenTabs);
    this.Menu = this.GenerateMenu(TabObject);
    this.CurrentMenuElementKey = TabObject.Items[0].Id;
  }
  GenerateMenu(TabObject) {
    let Menu = [];
    TabObject.Items.forEach((Element) => {
      Menu.push({
        label: Element.Caption,
        key: Element.Id,
      });
      Menu.push({ type: 'divider' });
    });
    return Menu;
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
