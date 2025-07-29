import { Modal, Form, Input, Button, Select, DatePicker, TimePicker } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import dayjs from "dayjs";
import type { ModalProps, Group } from "@types";
import { groupFormSchema } from "@utils";
import { useCourse, useGroup } from "@hooks";

interface GroupProps extends ModalProps {
  update: Group 
}

const GroupModal = ({ open, toggle, update }: GroupProps) => {
  const { mutate: createFn } = useGroup({ page: 1, limit: 5 }, update?.id).useGroupCreate();
  const { mutate: updateFn } = useGroup({ page: 1, limit: 5 }, update?.id).useGroupUpdate();
  const { data } = useCourse({ page: 1, limit: 10 });
  console.log("Course data:", data);


  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(groupFormSchema),
    defaultValues: {
      name: "",
      status: "",
      courseId: 0,

    },
  });

  useEffect(() => {
    if (update?.id) {
      setValue("name", update.name);
      setValue("status", update.status);
      setValue("courseId", update.courseId);
      setValue("start_date", dayjs(update.start_date)! );

    }
  }, [update, setValue]);

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      start_date: data.start_date ? dayjs(data.start_date).format("YYYY-MM-DD") : null,
    
      start_time: data.start_time?.format("HH:mm"),

      roomId:43
    };

    if (update?.id) {
      console.log("Updating group with data:", formattedData,"straniy yoli :",{...formattedData,id: update.id});
      
  updateFn({ ...formattedData, id: update.id });
    } else {
      createFn(formattedData);
    }

    toggle();
  };

  

  return (
    <Modal
      title="Group Modal"
      centered
      open={open}
      onCancel={toggle}
      width={700}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Group Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Name" />}
          />
        </Form.Item>

        <Form.Item
          label="Start Date"
          validateStatus={errors.start_date ? "error" : ""}
          help={errors.start_date?.message}
        >
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                placeholder="Start Date"
                format="YYYY-MM-DD"
                value={field.value}
                onChange={(date) => field.onChange(date)}
              />
            )}
          />
        </Form.Item>






{/* //------------------------------------ */}


<Form.Item
  label="Start Time"
  validateStatus={errors.start_time ? "error" : ""}
  help={errors.start_time?.message}
>
  <Controller
    name="start_time"
    control={control}
    render={({ field }) => (
      <TimePicker
        {...field}
        style={{ width: "100%" }}
        format="HH:mm"
        minuteStep={5}
        placeholder="Start Time"
        value={field.value as any}
        onChange={(time) => field.onChange(time)}
      />
    )}
  />
</Form.Item>






{/* //------------------------------------ */}



        <Form.Item
          label="Status"
          validateStatus={errors.status ? "error" : ""}
          help={errors.status?.message}
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "new", label: "New" },
                  { value: "completed", label: "Completed" },
                ]}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Course"
          validateStatus={errors.courseId ? "error" : ""}
          help={errors.courseId?.message}
        >
          <Controller
            name="courseId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                placeholder="Select course"
                optionFilterProp="label"
                options={data?.map((course: any) => ({
                  value: course.id,
                  label: course.title,
                }))}
              />
            )}
          />
        </Form.Item>

        {/* roomId */}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {update?.id ? "Update Group" : "Create Group"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupModal;
