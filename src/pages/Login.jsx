import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {AuthLogin} from "../redux/authen/authenSlice"
import { toast } from "react-toastify";
const Login = () => {
  //const { user } = useSelector((state) => state.auth);
  const {authUser,loading,error}=useSelector((state)=>state.authen)
  const dispath=useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (data) => {

    try{
      let AuthRequest={
        tenTaiKhoan:data.tenTaiKhoan,
        matKhau:data.matKhau
      }
      if(AuthRequest.tenTaiKhoan.trim()===""){
        toast.warning("Vui lòng nhập tài khoản")
        return
      }
      if(AuthRequest.matKhau.trim()===""){
        toast.warning("Vui lòng nhập đúng mật khẩu")
        return
      }
      console.log(AuthRequest)
      const result = await dispath(AuthLogin(AuthRequest))
      console.log(result)
      if(result.payload && result.payload.isSuccess){
        toast.success("Đăng nhập thành công")
        navigate('/home')
      }else{
        return
      }
    }catch(e){
      toast.warning("Lỗi khi đăng nhập")
      //return
    }
  };

  useEffect(() => {
    if (authUser) {
      navigate('/home');
    }
  }, [authUser, navigate]);
  useEffect(() => {
    if (error) {
      toast.error("Lỗi đăng nhập vui lòng thử lại");
    }
  }, [error]);
  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600'>
              Quản lý phân công công việc cho phòng ban và cá nhân!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Quản lý công việc</span>
              {/* <span>Dựa trên đám mây</span> */}
            </p>
    
            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>
    
        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Chào mừng trở lại!
              </p>
              <p className='text-center text-base text-gray-700 '>
                Giữ an toàn thông tin đăng nhập của bạn.
              </p>
            </div>
    
            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='tài khoản của bạn'
                type='text'
                name='tenTaiKhoan'
                label='Tài Khoản'
                className='w-full rounded-full'
                register={register("tenTaiKhoan", {
                  required: "Tài Khoản là bắt buộc!",
                })}
                error={errors.tenTaiKhoan ? errors.tenTaiKhoan.message : ""}
              />
              <Textbox
                placeholder='mật khẩu của bạn'
                type='password'
                name='matKhau'
                label='Mật khẩu'
                className='w-full rounded-full'
                register={register("matKhau", {
                  required: "Mật khẩu là bắt buộc!",
                })}
                error={errors.matKhau ? errors.matKhau.message : ""}
              />
    
              {/* <span className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
                Quên mật khẩu?
              </span> */}
    
              <Button
                type='submit'
                label='Gửi'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />
              {error &&(
                // <div className="alert alert-danger" role="alert">{error}</div>
                toast.error("Lỗi đăng nhập vui lòng thử lại")
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  
  );
};

export default Login;
