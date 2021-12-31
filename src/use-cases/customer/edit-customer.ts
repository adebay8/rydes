import makeCustomer from "../../database/helpers/customer";
import { ICustomerData, ICustomerSchema } from "../../types";

const makeEditCustomer = ({ customerSchema }: ICustomerSchema) => {
  return async ({ id, ...changes }: ICustomerData & { id: string }) => {
    // todo: implement valid for input data using joi
    if (!id) {
      throw new Error("You must supply an id.");
    }

    const existing = await customerSchema.findById({ customerId: id });

    if (!existing) {
      throw new RangeError("Customer not found.");
    }

    const customer = await makeCustomer({ ...existing, ...changes, id });

    if (customer.getHash() === existing.hash) {
      return existing;
    }

    const customerSource = customer.getSource();

    const updated = await customerSchema.update({
      id: customer.getId(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      email: customer.getEmail(),
      password: customer.getPassword(),
      phoneNumber: customer.getPhoneNumber(),
      source: {
        ip: customerSource.getIp(),
        browser: customerSource.getBrowser(),
        referrer: customerSource.getReferrer(),
      },
      hash: customer.getHash(),
    });
    return { ...updated };
  };
};

export default makeEditCustomer;
