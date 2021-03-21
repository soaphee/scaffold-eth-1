import React from "react";
import { Modal, Button, Form, Input, Checkbox } from 'antd';
import uuidv4 from 'uuid';
import openPGP from '../lib/openpgp'
import { getLive } from '../lib/apiTarget'
import { exampleCards } from '../lib/cardTestData'
import { default as cardsApi } from '../lib/cardsApi'
import { CreateCardPaymentPayload } from '../lib/paymentsApi'
import {
  CreateMarketplaceCardPaymentPayload,
  MarketplaceInfo,
} from '../lib/marketplaceApi'

export default function CircleFinModal(props) {
    const [visible, setVisible] = React.useState(false);

    const exampleCard = exampleCards[0]

    const makePayment = () => {
        console.log ('making payments');

        const payload = {
            idempotencyKey: uuidv4(),
            expMonth: parseInt(exampleCard.formData.expiry.month),
            expYear: parseInt(exampleCard.formData.expiry.year),
            keyId: '',
            encryptedData: '',
            billingDetails: {
              line1: exampleCard.formData.line1,
              city: exampleCard.formData.city,
              postalCode: exampleCard.formData.postalCode,
              country: exampleCard.formData.country,
              name: exampleCard.formData.name,
            },
            metadata: {
              sessionId: 'xxx',
              ipAddress: '172.33.222.1',
            },
          }

          try {
            const publicKey = cardsApi.getPCIPublicKey()
            const cardDetails = {
              number: exampleCard.formData.cardNumber.replace(/\s/g, ''),
              cvv: exampleCard.formData.cvv,
            }
            const encryptedData = openPGP.encrypt(cardDetails, publicKey)
            const { encryptedMessage, keyId } = encryptedData
            payload.keyId = keyId
            payload.encryptedData = encryptedMessage
            return cardsApi.createCard(payload)
          } catch (error) {
              console.log(error)
          }

        // setVisible(false)
    }

    return (
      <>
        <Button onClick={() => setVisible(true)}>
          Bid with USDC
        </Button>
        <Modal
          title="Enter Card Details"
          centered
          visible={visible}
          onOk={() => makePayment()}
          onCancel={() => setVisible(false)}
        >
          <h2>Credit Card Details</h2>
          <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="Card Number"
            name="Card Number"
            rules={[
              {
                required: true,
                message: 'Please input your credit card number!',
              },
            ]}
          >
            <Input placeholder="4007 4000 0000 0007" />
          </Form.Item>

          <Form.Item
            label="CVV"
            name="CVV"
            rules={[
              {
                required: true,
                message: 'Please input your CVV!',
              },
            ]}
          >
            <Input placeholder="123" />
          </Form.Item>

          <Form.Item
            label="Expiry"
            name="Expiry"
            rules={[
              {
                required: true,
                message: 'Please input your Expiry!',
              },
            ]}
          >
            <Input placeholder="01/2025" />
          </Form.Item>

          <h2>Billing Details</h2>

          <Form.Item
            label="Name"
            name="Name"
            rules={[
              {
                required: true,
                message: 'Please input your Name!',
              },
            ]}
          >
            <Input placeholder="Customer 0001" />
          </Form.Item>

          <Form.Item
            label="Address Line 1"
            name="Address Line 1"
            rules={[
              {
                required: true,
                message: 'Please input your Address Line 1!',
              },
            ]}
          >
            <Input placeholder="1000 Test Ave." />
          </Form.Item>

          <Form.Item
            label="Address Line 2"
            name="Address Line 2"
            rules={[
              {
                required: false,
                message: 'Please input your Address Line 2!',
              },
            ]}
          >
            <Input placeholder="Apt. 100" />
          </Form.Item>


          <Form.Item
            label="Zip Code"
            name="Zip Code"
            rules={[
              {
                required: true,
                message: 'Please input your Zip Code!',
              },
            ]}
          >
            <Input placeholder="11111" />
          </Form.Item>

          <Form.Item
            label="City"
            name="City"
            rules={[
              {
                required: true,
                message: 'Please input your City!',
              },
            ]}
          >
            <Input placeholder="Test City" />
          </Form.Item>


          <Form.Item
            label="State"
            name="State"
            rules={[
              {
                required: true,
                message: 'Please input your State!',
              },
            ]}
          >
            <Input placeholder="MA" />
          </Form.Item>

          <Form.Item
            label="Country Code"
            name="Country Code"
            rules={[
              {
                required: true,
                message: 'Please input your Country Code!',
              },
            ]}
          >
            <Input placeholder="United States" />
          </Form.Item>

        </Form>
        </Modal>
      </>
    );
}
