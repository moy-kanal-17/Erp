import * as yup from "yup";

// GROUP FORM
export const groupFormSchema = yup.object().shape({
  name: yup.string().min(5).required("Name is required"),
  status: yup.string().required("Status is required"),
  courseId: yup.number().required("Course is required"),
  start_date: yup.mixed().nullable(),
  end_date: yup.mixed().nullable(),
  start_time: yup.mixed().nullable(),
  end_time:yup.mixed().nullable(),
});
