class GlobalStore {
  OpenTabs = [];
  CurrentTabKey = null;
  TopMenu = [];

  constructor() {
    makeAutoObservable(this);
  }
}
