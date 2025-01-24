import React, { useEffect, useState } from "react";
//import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import Title from "../components/Title";
import { useDispatch, useSelector } from "react-redux";
import PageSizeSelect from "../components/PageSizeSelect";
import {
  deleteEmployee,
  fetchEmployees,
} from "../redux/employees/employeeSlice";
import AddEmployee from "../components/employee/AddEmployee";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import UpdateEmployee from "../components/employee/UpdateEmployee";
import { checkPermission } from "../redux/permissiondetail/permissionDetailSlice";
import getConnection from "../hub/signalRConnection";
import { toast } from "react-toastify";
const Employees = () => {
  const [pageSize, setPageSize] = useState(10);
  const employees = useSelector((state) => state.employees.list);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newconnection, setnewConnection] = useState(null);
  const [permissionAction, setpermissionAction] = useState([]);
  const maquyen = Number(localStorage.getItem("permissionId"));
  const chucVu = localStorage.getItem("role");
  const departmentId = localStorage.getItem("departmentId");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchEmployees({ search: "", page: pageSize }));
      const result = await dispatch(
        checkPermission({ maQuyen: maquyen, tenChucNang: "Nhân Viên" })
      ).unwrap();
      setpermissionAction(result);
    };
    fetchData();
  }, [dispatch, pageSize]);
  useEffect(() => {
    const connection = getConnection();
    const connectSignalR = async () => {
      try {
        if (connection && connection.state === "Disconnected") {
          await connection.start();
          console.log("Connected!");
        }
        connection.on("loadEmployee", async () => {
          await dispatch(fetchEmployees({ search: "", page: pageSize }));
        });

        connection.on("loadHanhDong", async () => {
          const result = await dispatch(
            checkPermission({ maQuyen: maquyen, tenChucNang: "Nhân Viên" })
          ).unwrap();
          setpermissionAction(result);
          console.log("employee");
        });
        console.log("Connected! update");
      } catch (error) {
        console.error("Connection failed: ", error);
      }
    };
    connectSignalR();
    return () => {
      if (connection) {
        connection.off("loadEmployee");
        connection.off("loadHanhDong");
      }
    };
  }, [dispatch, pageSize, maquyen]);
  const filteredEmployees =
    chucVu === "Trưởng Phòng"
      ? employees?.filter(
          (employee) => employee.maPhongBan === Number(departmentId)
        )
      : employees;
  const employeeActionHandler = () => {};
  const deleteHandler = () => {};

  const deleteClick = async (id) => {
    setSelected(id);
    //setOpenDialog(true);
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa nhân viên này không?"
    );

    if (confirmDelete) {
      try {
        var result = await dispatch(deleteEmployee(id));
        if (result !== null) {
          toast.success("Xóa Thành Công");
          return;
        }
      } catch (error) {
        toast.warning("Xóa Không Thành Công");
        return;
      }
    }
  };

  const editClick =async (employee) => {
    console.log(employee.maNhanVien);
    const con=getConnection()
    try {
          if (con.state === "Disconnected") {
            await con.start();
          }
          //setnewConnection(con)
          await con.invoke("SendMessageToUser",employee.maNhanVien+"","Hello Ní")
          // con.on("ReceiveMessageTest", async (message) => {
          //           console.log(message)
          //         });
          // await con.invoke("ThamGiaNhom",employee.maNhanVien+"")
          // con.on("UserJoined", async (message) => {
          //           console.log(message)
          //         });
          } catch (err) {
            console.error("Connection failed: ", err);
        }
  };
  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Nhân Viên</th>
        <th className="py-2">Phòng Ban</th>
        <th className="py-2">Chức Vụ</th>
        <th className="py-2">Số Điện Thoại</th>
        <th className="py-2">Email</th>
      </tr>
    </thead>
  );
  const TableRow = ({ employee }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">
              {employee.tenNhanVien}
            </span>
          </div>
          {employee.tenNhanVien}
        </div>
      </td>

      <td className="p-2">{employee.maPhongBan}</td>
      <td className="p-2">{employee.tenChucVu}</td>
      <td className="p-2">{employee.soDienThoai}</td>
      <td className="p-2">{employee.email}</td>
      <td>
        <button
          // onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            employee.trangThai ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {employee?.trangThai ? "Active" : "Disabled"}
        </button>
      </td>

      <td className="p-2 flex gap-4 justify-end">
        {permissionAction.includes("Sửa") && (
          <Button
            className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
            label="Edit"
            type="button"
            onClick={() => editClick(employee)}
          />
        )}
        {permissionAction.includes("Xóa") && (
          <Button
            className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
            label="Delete"
            type="button"
            onClick={() => deleteClick(employee.maNhanVien)}
          />
        )}
      </td>
    </tr>
  );

  return (
    <>
      <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Nhân Viên" />
          {permissionAction.includes("Thêm") && (
            <Button
              label="Thêm Nhân Viên Mới"
              icon={<IoMdAdd className="text-lg" />}
              className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
              onClick={() => setOpen(true)}
            />
          )}
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {filteredEmployees?.map((employee, index) => (
                  <TableRow key={index} employee={employee} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddEmployee
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />
      <UpdateEmployee
        open={openUpdate}
        setOpen={setOpenUpdate}
        employeeData={selectedEmployee}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={employeeActionHandler}
      />
    </>
  );
};

export default Employees;
