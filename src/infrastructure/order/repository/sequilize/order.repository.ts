import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction: t });
      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction: t }
      );
    });
  }

  async find(id: string): Promise<Order> {
    const order = await OrderModel.findOne({ 
      where: { id: id },
      include: [{ model: OrderItemModel }]
    });

    if(!order) {
      throw new Error("Order not found");
    }

    const orderItemEntity = order.items.map(item => 
      new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      )
    );

    const orderEntity = new Order(order.id, order.customer_id, orderItemEntity);

    return orderEntity;
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({ 
      include: [{ model: OrderItemModel }]
    });

    if(!orders) {
      throw new Error("Order not found");
    }

    return orders.map( order => {
      const orderItemEntity = order.items.map(item => 
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
      );
  
      const orderEntity = new Order(order.id, order.customer_id, orderItemEntity);
      
      return orderEntity;
    });
  }
}
