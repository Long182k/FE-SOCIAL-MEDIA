import { Modal, Form, Input, Button, message } from "antd";

interface MessageModalProps {
  visible: boolean;
  onCancel: () => void;
}

const MessageModal = ({ visible, onCancel }: MessageModalProps) => (
  <Modal
    title="Message Seller"
    visible={visible}
    onCancel={onCancel}
    footer={[
      <Button key="send" type="primary" onClick={() => message.info("Message sent!")}>
        Send Message
      </Button>,
    ]}
  >
    <Form layout="vertical">
      <Form.Item label="Your Message">
        <Input.TextArea rows={4} placeholder="Type your message here..." />
      </Form.Item>
    </Form>
  </Modal>
);

export default MessageModal;
