import EventInterface from "../../@shared/event/event.interface";

export default class CustomerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
    this.validate();
  }

  private validate() {
    if(!this.eventData.position){
      throw new Error("Position in missing");
    }
  }
}