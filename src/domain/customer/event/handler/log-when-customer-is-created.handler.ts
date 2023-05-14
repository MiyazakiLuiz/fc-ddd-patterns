import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class LogWhenCustomerIsCreated 
  implements EventHandlerInterface<CustomerCreatedEvent> 
{
  handle(event: CustomerCreatedEvent): void {
    console.log(`Esse é o ${event.eventData?.position} console.log do evento: CustomerCreated`);
  }
}