import { lessonService } from "@service";
import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";
import type { Lesson } from "../../types/lessons";

const { Option } = Select;

export type LessonType = {
  id: number;
  title: string;
  status: string;
};

type LessonModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LessonType) => void;
  initialData?: LessonType | null;
};

const LessonModal = ({ open, onClose, initialData }: LessonModalProps) => {
  const [form] = Form.useForm();

  const onSubmit = (result: Lesson) => {
    lessonService.updateGroup(result);
  };
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const result = values;
        onSubmit(result);
        onClose();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      open={open}
      title={initialData ? "Edit Lesson" : "Add Lesson"}
      onCancel={onClose}
      onOk={handleOk}
      okText="Save"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Lesson Title"
          name="title"
          rules={[{ required: true, message: "Please enter lesson title" }]}
        >
          <Input placeholder="Enter lesson title" />
        </Form.Item>

        <Form.Item
          label="Data"
          name="date"
          rules={[{ required: true, message: "Please select data" }]}
        >
          <Input placeholder="Enter lesson title" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Option value="yangi">yangi</Option>
            <Option value="canseled">canseled</Option>
            <Option value="cansel">cansel</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LessonModal;
