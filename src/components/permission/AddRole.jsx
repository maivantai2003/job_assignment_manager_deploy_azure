import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addPermission } from "../../redux/permission/permissionSlice";

const AddRole = ({ open, setOpen}) => {
  const dispatch=useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submitHandler =async (data) => {
    if(data.tenNhomQuyen===null || data.tenNhomQuyen.trim()===""){
        toast.warning("Vui lòng nhập tên quyền")
        return
    }
    try {
        await dispatch(addPermission({
            tenQuyen:data.tenNhomQuyen
        })); 
        toast.success("Thêm thành công")
        setOpen(false);
    } catch (error) {
      toast.error("Thêm thất bại")
        console.error("Failed to add section: ", error);
      }
  };
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            THÊM NHÓM QUYỀN
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Nhóm quyền'
              type='text'
              name='title'
              label='Nhóm quyền'
              className='w-full rounded'
              register={register("tenNhomQuyen", { required: "Tên Nhóm Quyền là bắt buộc" })}
              error={errors.tenNhomQuyen ? errors.tenNhomQuyen.message : ""}
            />
            
            <div className='flex gap-4'>
                <Button
                  label='Gửi'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                />
              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Hủy'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddRole;
