import * as yup from "yup";

// GROUP FORM
export const groupFormSchema = yup.object().shape({
  name: yup.string().min(5).required("Name is required"),
  status: yup.string().required("Status is required"),
  courseId: yup.number().required("Course is required"),
  start_date: yup.mixed().nullable(),
  // end_date: yup.mixed().nullable(),
  start_time: yup.mixed().nullable(),
  // end_time:yup.mixed().nullable(),
});


// BRANCH FORM
// import * as yup from "yup";

export const branchFormSchema = yup.object().shape({
  name: yup.string().required("Branch nomi majburiy"),
  address: yup.string().required("Manzil majburiy"),
  call_number: yup
    .string()
    .required("Telefon raqami majburiy")
    .matches(
      /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/,
      "Raqam formati: +998 (90) 123-45-67"
    ),
});
