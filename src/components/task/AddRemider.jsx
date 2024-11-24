import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { generateReminderEmailTemplate } from "../../utils/remiderTemplateEmail";
import { sendGmail } from "../../redux/sendgmail/sendgmailSlice";
const AddRemider = ({ setOpenRemider,openRemider,nhanViens }) => {
  const dispatch = useDispatch();
  const [remider,setRemider]=useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submitHandler = async (data) => {
    console.log(nhanViens)
    try {
        setTimeout(async () => {
            const employeeEmailPromises = nhanViens.map((employee) => 
              dispatch(
                sendGmail({
                  name: employee.tenNhanVien,
                  toGmail: employee.email,
                  subject: remider,
                  body: generateReminderEmailTemplate(employee,remider),
                })
              )
            )
            await Promise.all(employeeEmailPromises);
            console.log("Email đã được gửi!");
          },5000);
          toast.success("Tạo Nhắc Nhở Thành Công")
          setOpenRemider(false)
    } catch (error) {
      toast.error("Thêm thất bại");
    }
  };
  return (
    <>
      <ModalWrapper open={openRemider} setOpen={setOpenRemider}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            TẠO NHẮC NHỞ
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
          <div>
              <label className="block text-sm font-medium text-gray-700">
                Nội dung nhắc nhở
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-2 border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                value={remider}
                onChange={(e) => setRemider(e.target.value)}
                placeholder="Nhập nội dung nhắc nhở"
              />
            </div>

            <div className="flex gap-4">
              <Button
                label="Gửi"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
              />
              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpenRemider(false)}
                label="Hủy"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddRemider;
