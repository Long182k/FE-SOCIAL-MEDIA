import { Modal, Button, Typography, message } from "antd";

const { Text } = Typography;

interface PaymentModalProps {
  visible: boolean;
  product: any;
  onCancel: () => void;
}

const PaymentModal = ({ visible, product, onCancel }: PaymentModalProps) => (
  <Modal
    title="Buy Now"
    visible={visible}
    onCancel={onCancel}
    footer={[
      <Button key="pay" type="primary" onClick={() => message.info("Payment processed!")}>
        Confirm Payment
      </Button>,
    ]}
  >
    <Text>Confirm purchase for {product?.title} at ${product?.price}?</Text>
  </Modal>
);

export default PaymentModal;
