import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { useDispatch } from "react-redux";
import EmployeeSelectDepartment from "./EmployeeSelectDepartment";
import { addAssignment } from "../../redux/assignment/assignmentSlice";
import { addTaskHistory } from "../../redux/taskhistory/taskhistorySlice";
import { toast } from "react-toastify";
import { generateEmailTemplate } from "../../utils/emailTemplates";
import { generateDeadlineNotification } from "../../utils/emailDealineTemplates";
import { sendNotification } from "../../redux/scheduling/schedulingSlice";
import { sendGmail } from "../../redux/sendgmail/sendgmailSlice";
const LISTS = ["CAO", "TRUNG BÌNH", "BÌNH THƯỜNG", "THẤP"];
const PRIORITY = ["CAO", "TRUNG BÌNH", "BÌNH THƯỜNG", "THẤP"];
const uploadedFileURLs = [];
const AddTaskEmployee = ({
  open,
  setOpen,
  maCongViec,
  maPhongBan,
  tenCongViec,
  nhanViens,
  thoiGianKetThuc
}) => {
  const task = "";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [team, setTeam] = useState(task?.team || []);
  const dispatch = useDispatch();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setloading] = useState(false);
  const submitHandler = async (data) => {
    console.log(selectedEmployees);
    if (selectedEmployees.length === 0) {
      toast.warning("Vui lòng chọn nhân viên");
      return;
    }
    const missingRoles = selectedEmployees.some(
      (employee) => !employee.vaiTro || employee.vaiTro.trim() === ""
    );
    if (missingRoles) {
      toast.warning("Vui lòng chọn vai trò cho tất cả nhân viên");
      return;
    }

    try {
     setloading(true)
      if (Array.isArray(selectedEmployees) && selectedEmployees.length > 0) {
        const employeePromises = selectedEmployees.map(async (employee) => {
          console.log(await dispatch(
            addAssignment({
              maCongViec: maCongViec,
              maNhanVien: Number(employee.maNhanVien),
              vaiTro: employee.vaiTro,
            })
          ));
          await dispatch(
            addTaskHistory({
              maCongViec: maCongViec,
              ngayCapNhat: new Date().toISOString(),
              noiDung: `${new Date().toISOString()}: Nhân Viên ${
                employee.tenNhanVien
              } được phân công việc ${tenCongViec}`,
            })
          );
        });
        await Promise.all(employeePromises);
        await dispatch(
          sendNotification({
            maCongViec: maCongViec,
            tenCongViec: tenCongViec,
            noiDung: generateDeadlineNotification(tenCongViec, thoiGianKetThuc),
            thoiGianKetThuc: thoiGianKetThuc,
            email: selectedEmployees.map((item) => item.email).join(","),
          })
        );
        setTimeout(async () => {
          const employeeEmailPromises = selectedEmployees.map((employee) => 
            dispatch(
              sendGmail({
                name: employee.tenNhanVien,
                toGmail: employee.email,
                subject: "Thông Tin Phân Công Dự Án",
                body: generateEmailTemplate(employee),
              })
            )
          )
          await Promise.all(employeeEmailPromises);
          console.log("Email đã được gửi!");
        },5000);
      }
      toast.success("Thêm thành công");
      setOpen(false);
      clearForm()
    } catch (e) {
      toast.error("Thêm thất bại");
      console.log(e);
    }finally{
      setloading(false)
    }
  };
  const handleSelect = (e) => {
    setAssets(e.target.files);
  };
  const clearForm=()=>{
    setSelectedEmployees([]);
    reset()
  }
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <div className="max-h-screen overflow-y-auto">
          <form onSubmit={handleSubmit(submitHandler)}>
            <Dialog.Title
              as="h2"
              className="text-base font-bold leading-6 text-gray-900 mb-4"
            >
              THÊM PHÂN CÔNG NHÂN VIÊN
            </Dialog.Title>
            <div className="mt-2 flex flex-col gap-6">
              <EmployeeSelectDepartment
                maPhongBan={maPhongBan}
                selectedEmployees={selectedEmployees}
                setSelectedEmployees={setSelectedEmployees}
                nhanViens={nhanViens}
              />
              <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
                {loading ? (
                   <Button
                   label="Đang gửi..."
                   type="button"
                   className="bg-gray-400 px-8 text-sm font-semibold text-white cursor-not-allowed"
                   disabled
                 />
                ) : (
                  <Button
                    label="Thêm"
                    type="submit"
                    className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                  />
                )}

                <Button
                  type="button"
                  className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                  onClick={() =>{
                    setOpen(false)
                    clearForm()}}
                  label="Hủy"
                />
              </div>
            </div>
          </form>
        </div>
      </ModalWrapper>
    </>
  );
};
export default AddTaskEmployee;
