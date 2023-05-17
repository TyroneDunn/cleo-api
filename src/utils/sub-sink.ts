import {Subscription} from "rxjs";

export class SubSink {
  private subscriptions: Subscription[] = [];
  public collect(subscription: Subscription) {
    this.subscriptions = this.subscriptions.concat(subscription);
  }
  public drain() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
