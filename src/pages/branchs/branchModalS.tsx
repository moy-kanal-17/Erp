import { Modal, Form, Input, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import type { ModalProps, Branch } from "@types";
import { branchFormSchema } from "@utils";
import { useBranch } from "../../hooks/useBranch";

interface BranchProps extends ModalProps {
  update: Branch | undefined;
}

const BranchModal = ({ open, toggle, update }: BranchProps) => {
  const { mutate: createFn } = useBranch({ page: 1, limit: 5 }).useBranchCreate();
  const { mutate: updateFn } = useBranch({ page: 1, limit: 5 }).useBranchUpdate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(branchFormSchema),
    defaultValues: {
      name: "",
      address: "",
      call_number: "",
    },
  });

  useEffect(() => {
    if (update?.id) {
      setValue("name", update.name);
      setValue("address", update.address);
      setValue("call_number", update.call_number as any);
    }
  }, [update, setValue]);

  const onSubmit = (data: any) => {
    if (update?.id) {
      console.log("update", {...data, id: update.id },update.id);
      
      updateFn({ ...data, id: update.id });
    } else {
      createFn(data);
    }

    toggle();
  };

  return (
    <Modal
      title="Branch Modal"
      centered
      open={open}
      onCancel={toggle}
      width={700}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Branch Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Branch Name" />}
          />
        </Form.Item>

        <Form.Item
          label="Address"
          validateStatus={errors.address ? "error" : ""}
          help={errors.address?.message}
        >
          <Controller
            name="address"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Branch Address" />}
          />
        </Form.Item>

        <Form.Item
          label="Call Number"
          validateStatus={errors.call_number ? "error" : ""}
          help={errors.call_number?.message}
        >
          <Controller
            name="call_number"
            control={control}
            render={({ field }) => <Input {...field} placeholder="+998901234567" />}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {update?.id ? "Update Branch" : "Create Branch"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BranchModal;
