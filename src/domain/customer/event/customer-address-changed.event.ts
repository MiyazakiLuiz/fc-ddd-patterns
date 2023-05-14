import EventInterface from "../../@shared/event/event.interface";

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
    this.validate();
  }

  private validate() {
    if(!this.eventData.name){
      throw new Error("Name in missing");
    }
    if(!this.eventData.id){
      throw new Error("ID in missing");
    }
    if(!this.eventData.address){
      throw new Error("Address in missing");
    }
  }
}